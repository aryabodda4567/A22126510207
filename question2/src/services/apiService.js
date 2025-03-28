const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('axios-rate-limit');

const BASE_URL = 'http://20.244.56.144/test';

// Auth credentials
const AUTH_CREDENTIALS = {
    companyName: "AffordMed",
    clientID: "A22126510207",
    clientSecret: "8c6993f3d2d44c5c8d2e7",
    ownerName: "Arya",
    ownerEmail: "arya.cs21@bmsce.ac.in",
    rollNo: "A22126510207"
};

let authToken = null;

// Function to refresh token
const refreshToken = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auth`, AUTH_CREDENTIALS);
        authToken = response.data.access_token;
        return authToken;
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
};

// Function to get users
const getUsers = async () => {
    try {
        // First try without token
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // If unauthorized, get new token and retry
            const token = await refreshToken();
            const retryResponse = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return retryResponse.data;
        }
        throw error;
    }
};

// Function to get user posts
const getUserPosts = async (userId) => {
    try {
        const token = await refreshToken();
        const response = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // If unauthorized, get new token and retry
            const token = await refreshToken();
            const retryResponse = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return retryResponse.data;
        }
        throw error;
    }
};

module.exports = {
    getUsers,
    getUserPosts
};

