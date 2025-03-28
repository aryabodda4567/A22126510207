const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache for storing data
let userPostCounts = new Map();
let posts = [];

// Function to fetch data from the social media platform API
async function fetchData() {
    try {
        // Replace with actual API endpoint
        const response = await axios.get(process.env.SOCIAL_MEDIA_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to update user post counts
function updateUserPostCounts(data) {
    userPostCounts.clear();
    data.forEach(post => {
        const userId = post.userId;
        userPostCounts.set(userId, (userPostCounts.get(userId) || 0) + 1);
    });
}

// Function to update posts
function updatePosts(data) {
    posts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Route to get top users
app.get('/users', (req, res) => {
    const topUsers = Array.from(userPostCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId, count]) => ({ userId, postCount: count }));

    res.json(topUsers);
});

// Route to get top/latest posts
app.get('/posts', (req, res) => {
    const { type } = req.query;

    if (type === 'latest') {
        const latestPosts = posts.slice(0, 5);
        res.json(latestPosts);
    } else if (type === 'popular') {
        const maxComments = Math.max(...posts.map(post => post.comments.length));
        const popularPosts = posts.filter(post => post.comments.length === maxComments);
        res.json(popularPosts);
    } else {
        res.status(400).json({ error: 'Invalid type parameter. Use "latest" or "popular"' });
    }
});

// Initialize data and set up periodic updates
async function initializeData() {
    const data = await fetchData();
    if (data) {
        updateUserPostCounts(data);
        updatePosts(data);
    }
}

// Update data every 5 minutes
setInterval(initializeData, 5 * 60 * 1000);

// Start server
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await initializeData();
}); 