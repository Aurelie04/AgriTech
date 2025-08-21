const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust path if your DB connection file is elsewhere

// POST /api/commodities - Add new commodity
router.post('/commodities', (req, res) => {
  const { name, category, price, quantity, origin, userId } = req.body;

  if (!name || !price || !quantity || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO commodities (name, quantity, price, origin, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, category, price, quantity, origin, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add commodity' });
    }

    res.json({ message: 'Commodity added successfully' });
  });
});

module.exports = router;
