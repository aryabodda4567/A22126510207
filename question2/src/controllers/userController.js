const { getTopUsers } = require('../services/userService');

const getTopUsersHandler = async (req, res) => {
    try {
        console.log('Fetching top users...');

        const topUsers = await getTopUsers();
        
        console.log('Successfully fetched top users:', topUsers);

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