const db = require('../db'); // Ensure this points to your DB connection file

// Create a new seller profile
const createSellerProfile = (req, res) => {
  const {
    user_id, full_name, business_name, country, province,
    city, phone, email, commodity_type
  } = req.body;

  const sql = `
    INSERT INTO seller_profiles 
    (user_id, full_name, business_name, country, province, city, phone, email, commodity_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id, full_name, business_name, country, province,
    city, phone, email, commodity_type
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Seller profile created successfully' });
  });
};

// Verify seller profile by ID
const verifySeller = (req, res) => {
  const sellerId = req.params.id;

  const sql = `UPDATE seller_profiles SET is_verified = 1, verification_date = NOW() WHERE id = ?`;

  db.query(sql, [sellerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Verification failed' });
    }
    res.json({ message: 'Seller verified successfully' });
  });
};

// Get all verified sellers filtered by commodity and country
const getVerifiedSellers = (req, res) => {
  const { commodity, country } = req.query;

  const sql = `
    SELECT * FROM seller_profiles 
    WHERE is_verified = 1 AND commodity_type = ? AND country = ?
  `;

  db.query(sql, [commodity, country], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching sellers' });
    }
    res.json(results);
  });
};

// Get seller profile by user_id
const getSellerProfileByUserId = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT * FROM seller_profiles
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching seller profile:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    res.json(result[0]);
  });
};

// (Optional) Get all commodity prices
const getPrices = (req, res) => {
  const sql = `SELECT * FROM commodity_prices`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Price fetch failed' });
    }
    res.json(rows);
  });
};

// ✅ Export all controllers explicitly
module.exports = {
  createSellerProfile,
  verifySeller,
  getVerifiedSellers,
  getSellerProfileByUserId,
  getPrices, // Optional, if used elsewhere
};
