const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust if needed

router.post('/', (req, res) => {
  const { name, quantity, price, origin, userId } = req.body;

  if (!name || !price || !quantity || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO commodities (name, price, quantity, origin, userId)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, price, quantity, origin, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add commodity' });
    }

    res.json({ message: 'Commodity added successfully' });
  });
});

module.exports = router;
