const express = require('express');
const router = express.Router();


const { getTopUsersHandler } = require('../controllers/userController');

router.get('/users', getTopUsersHandler);

module.exports = router; 