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

  db.query('SELECT * FROM farmers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO farmers (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login with session management
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM farmers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    // Set session
    req.session.user = {
      id: results[0].id,
      name: results[0].name,
      email: results[0].email,
    };

    return res.status(200).json({ 
      message: 'Login successful',
      user: req.session.user
    });
  });
});

// Logout route (optional)
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid'); // Clear session cookie
    return res.status(200).json({ message: 'Logout successful' });
  });
});

// Get current session user
router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401).json({ message: 'Not logged in' });
  }
});

module.exports = router;
