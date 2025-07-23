const express = require('express');
const router = express.Router();
const solarFinanceController = require('../controllers/solarFinanceController');

// Submit a new solar finance application
router.post('/apply', solarFinanceController.createApplication); // FIXED here

// Get all submitted applications
router.get('/', solarFinanceController.getAllApplications);

// Get a specific application by ID
router.get('/:id', solarFinanceController.getApplicationById);

// Delete an application by ID
router.delete('/:id', solarFinanceController.deleteApplication);

module.exports = router;
