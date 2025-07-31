const express = require('express');
const axios = require('axios');
const router = express.Router();

// External API endpoint
const BASE_URL = 'https://open.er-api.com/v6/latest';

// GET /api/exchange?base=USD&symbols=ZAR,EUR
router.get('/', async (req, res) => {
  const { base = 'USD', symbols = 'ZAR,EUR,USD' } = req.query;

  try {
    const response = await axios.get(`${BASE_URL}/${base}`);

    const allRates = response.data.rates;

    // Filter the rates based on requested symbols
    const filteredRates = {};
    symbols.split(',').forEach((symbol) => {
      if (allRates[symbol]) {
        filteredRates[symbol] = allRates[symbol];
      }
    });

    res.json({
      success: true,
      base: response.data.base_code,
      date: response.data.time_last_update_utc,
      rates: filteredRates,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rates',
    });
  }
});

module.exports = router;
