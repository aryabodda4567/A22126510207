const { getTopUsersByPosts } = require('../services/apiService');

const getTopUsersHandler = async (req, res) => {
    try {
        console.log('Fetching top users by post count...');
        const topUsers = await getTopUsersByPosts();
        res.json(topUsers);
    } catch (error) {
        console.error('Detailed error in getTopUsersHandler:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ 
            error: 'Failed to fetch top users',
            details: error.message
        });
    }
};

module.exports = {
    getTopUsersHandler
}; 