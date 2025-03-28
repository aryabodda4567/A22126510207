const express = require('express');
const router = express.Router();
const { getPostsHandler } = require('../controllers/postController');

// GET /posts?type=latest
// GET /posts?type=popular
router.get('/posts', getPostsHandler);

module.exports = router; 