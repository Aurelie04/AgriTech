const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Ensure all required controller functions are defined
if (
  typeof sellerController.createSellerProfile !== 'function' ||
  typeof sellerController.verifySeller !== 'function' ||
  typeof sellerController.getVerifiedSellers !== 'function' ||
  typeof sellerController.getSellerProfileByUserId !== 'function' ||
  typeof sellerController.getPrices !== 'function'

) {
  throw new Error('One or more required controller functions are missing or not valid functions');
}

// Define the routes
router.post('/create-profile', sellerController.createSellerProfile);
router.put('/verify/:id', sellerController.verifySeller);
router.get('/verified', sellerController.getVerifiedSellers);
router.get('/profile/:userId', sellerController.getSellerProfileByUserId);
router.get('/prices', sellerController.getPrices);

module.exports = router;
