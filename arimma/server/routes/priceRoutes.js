const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Just one route for prices
router.get('/prices', sellerController.getPrices);

module.exports = router;
