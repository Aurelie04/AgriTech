const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user exists
  db.query('SELECT * FROM farmers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO farmers (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM farmers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    return res.status(200).json({ message: 'Login successful', user: { id: results[0].id, name: results[0].name, email: results[0].email } });
  });
});

module.exports = router;
