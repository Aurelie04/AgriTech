const db = require('../db'); // Adjust the path based on your project structure

// Verify seller
exports.verifySeller = (req, res) => {
  const sellerId = req.params.id;
  const sql = `
    UPDATE seller_profiles 
    SET is_verified = 1, verification_date = NOW() 
    WHERE id = ?
  `;
  db.query(sql, [sellerId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Verification failed' });
    res.json({ message: 'Seller verified successfully' });
  });
};

// Get verified sellers based on commodity and country
exports.getVerifiedSellers = (req, res) => {
  const { commodity, country } = req.query;
  const sql = `
    SELECT * FROM seller_profiles 
    WHERE is_verified = 1 AND commodity_type = ? AND country = ?
  `;
  db.query(sql, [commodity, country], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching sellers' });
    res.json(results);
  });
};
