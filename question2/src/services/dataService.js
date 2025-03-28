const axios = require('axios');
const { updateUserPostCounts } = require('./userService');
const { updatePosts } = require('./postService');

const fetchData = async () => {
    try {
        const response = await axios.get(process.env.SOCIAL_MEDIA_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

const initializeData = async () => {
    const data = await fetchData();
    if (data) {
        updateUserPostCounts(data);
        updatePosts(data);
    }
};

const startDataUpdates = (interval = 5 * 60 * 1000) => {
    // Initial data fetch
    initializeData();
    
    // Set up periodic updates
    setInterval(initializeData, interval);
};

module.exports = {
    fetchData,
    initializeData,
    startDataUpdates
}; 