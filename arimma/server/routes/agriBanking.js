const express = require('express');
const router = express.Router();
const agriBankingController = require('../controllers/agriBankingController');

router.post('/submit', agriBankingController.submitAgriBanking);

module.exports = router;
