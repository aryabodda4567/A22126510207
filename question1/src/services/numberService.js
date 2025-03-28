require('dotenv').config();
const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('axios-rate-limit');

// Cache configuration
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) });

// Define the number mapping
const numberMapping = {
   "p":"prime",
   "f":"fibonacci",
   "e":"even",
   "r":"random"
};

// API configuration
const API_CONFIG = {
    baseURL: process.env.API_BASE_URL,
    authURL: process.env.API_AUTH_URL,
    maxRetries: parseInt(process.env.API_MAX_RETRIES),
    timeout: parseInt(process.env.API_TIMEOUT),
    maxWindowSize: parseInt(process.env.API_MAX_WINDOW_SIZE)
};

// Auth credentials
const AUTH_CREDENTIALS = {
    companyName: process.env.COMPANY_NAME,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL,
    rollNo: process.env.ROLL_NO
};

// Create rate-limited axios instance
const axiosInstance = rateLimit(axios.create({
    timeout: API_CONFIG.timeout
}), { 
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS), 
    perMilliseconds: parseInt(process.env.RATE_LIMIT_PER_MS) 
});

// Global state to maintain window
let windowState = {
    prevState: [],
    currState: [],
    numbers: []
};

// Helper function to calculate average
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

// Function to clean up window state if it exceeds max size
const cleanupWindowState = () => {
    if (windowState.numbers.length > API_CONFIG.maxWindowSize) {
        const excess = windowState.numbers.length - API_CONFIG.maxWindowSize;
        windowState.numbers = windowState.numbers.slice(excess);
        windowState.currState = windowState.currState.slice(-API_CONFIG.maxWindowSize);
        windowState.prevState = windowState.prevState.slice(-API_CONFIG.maxWindowSize);
    }
};

// Function to refresh token with caching
const refreshToken = async () => {
    const cacheKey = 'auth_token';
    const cachedToken = cache.get(cacheKey);
    
    if (cachedToken) {
        return cachedToken;
    }

    try {
        const response = await axiosInstance.post(API_CONFIG.authURL, AUTH_CREDENTIALS);
        const token = response.data.access_token;
        cache.set(cacheKey, token, parseInt(process.env.CACHE_TTL));
        return token;
    } catch (error) {
        throw new Error('Failed to refresh token: ' + error.message);
    }
};

// Function to make API request with retry and caching
const makeAPIRequest = async (numberType) => {
    const cacheKey = `api_${numberType}`;
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
        return { data: cachedResponse };
    }

    let lastError;
    for (let i = 0; i < API_CONFIG.maxRetries; i++) {
        try {
            const token = await refreshToken();
            const response = await axiosInstance.get(`${API_CONFIG.baseURL}/${numberType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            cache.set(cacheKey, response.data, parseInt(process.env.CACHE_TTL));
            return response;
        } catch (error) {
            lastError = error;
            if (error.response?.status === 401) {
                await refreshToken();
            } else if (error.response?.status >= 500) {
                // Wait before retrying on server errors
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            } else {
                throw error; // Don't retry on client errors
            }
        }
    }
    throw lastError;
};

// Function to process response data
const processResponseData = (data) => {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            throw new Error('Invalid JSON response');
        }
    }
    
    if (!data || !data.numbers || !Array.isArray(data.numbers)) {
        throw new Error('Invalid response format: expected object with number array');
    }
    
    return data.numbers;
};

const getNumberById = async (numberId) => {
    if (!numberMapping[numberId]) {
        throw new Error('Number not found in mapping');
    }

    try {
        const numberType = numberMapping[numberId];
        const response = await makeAPIRequest(numberType);
        const processedData = processResponseData(response.data);

        // Update window state
        windowState.prevState = windowState.currState.length > 0 ? [...windowState.currState] : [];
        windowState.currState = processedData;
        windowState.numbers = [...windowState.numbers, ...processedData];

        // Clean up if window size exceeds limit
        cleanupWindowState();

        const avg = calculateAverage(windowState.numbers);

        return {
            windowPrevState: windowState.prevState.length > 0 ? windowState.prevState : [],
            windowCurrState: windowState.currState,
            numbers: windowState.numbers,
            avg: parseFloat(avg)
        };
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

module.exports = {
    getNumberById
}; 