const express = require('express');
const router = express.Router();
const { getPostsHandler } = require('../controllers/postController');


router.get('/posts', getPostsHandler);

module.exports = router; 