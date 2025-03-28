const axios = require('axios');
require('dotenv').config();

let authToken = null;

// Function to refresh token
const refreshToken = async () => {
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/auth`, {
            companyName: process.env.COMPANY_NAME,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            ownerName: process.env.OWNER_NAME,
            ownerEmail: process.env.OWNER_EMAIL,
            rollNo: process.env.ROLL_NO
        });
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
        if (authToken) {
            try {
                const response = await axios.get(`${process.env.API_BASE_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                return response.data.user;
            } catch (error) {
                if (error.response?.status !== 401) {
                    throw error;
                }
            }
        }

        const token = await refreshToken();
        const response = await axios.get(`${process.env.API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.user;
    } catch (error) {
        console.error('Error in getUsers:', error.message);
        throw error;
    }
};

// Function to get user posts
const getUserPosts = async (userId) => {
    try {
        if (authToken) {
            try {
                const response = await axios.get(`${process.env.API_BASE_URL}/users/${userId}/posts`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                return response.data.posts;
            } catch (error) {
                if (error.response?.status !== 401) {
                    throw error;
                }
            }
        }

        const token = await refreshToken();
        const response = await axios.get(`${process.env.API_BASE_URL}/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.posts;
    } catch (error) {
        console.error('Error in getUserPosts:', error.message);
        throw error;
    }
};

// Function to get top users by post count
const getTopUsersByPosts = async (limit = 5) => {
    try {
        const users = await getUsers();
        const userPostCounts = [];
        
        for (const [userId, userName] of Object.entries(users)) {
            try {
                const posts = await getUserPosts(userId);
                userPostCounts.push({
                    userId,
                    userName,
                    postCount: posts.length
                });
            } catch (error) {
                console.error(`Error getting posts for user ${userId}:`, error.message);
                continue;
            }
        }

        return userPostCounts
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, limit);
    } catch (error) {
        console.error('Error in getTopUsersByPosts:', error.message);
        throw error;
    }
};

module.exports = {
    getUsers,
    getUserPosts,
    getTopUsersByPosts
};

