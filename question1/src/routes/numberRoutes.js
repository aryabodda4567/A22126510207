const express = require('express');
const router = express.Router();
const numberController = require('../controllers/numberController');

// Define routes here
router.get('/:numberId', numberController.processNumbers);

module.exports = router; 