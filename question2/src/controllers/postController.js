const { getLatestPosts, getPopularPosts } = require('../services/postService');

const getPostsHandler = (req, res) => {
    try {
        const { type } = req.query;

        if (type === 'latest') {
            const latestPosts = getLatestPosts();
            res.json(latestPosts);
        } else if (type === 'popular') {
            const popularPosts = getPopularPosts();
            res.json(popularPosts);
        } else {
            res.status(400).json({ error: 'Invalid type parameter. Use "latest" or "popular"' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPostsHandler
}; 