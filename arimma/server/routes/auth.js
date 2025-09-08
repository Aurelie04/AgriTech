const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// ---------- REGISTER ----------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [existing] = await db.query('SELECT * FROM farmers WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO farmers (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword
    ]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM farmers WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password' });

    req.session.userId = rows[0].id;
    req.session.userName = rows[0].name;
    req.session.email = rows[0].email;

    res.json({ message: 'Login successful', user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- LOGOUT ----------
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('arimma.sid');
    res.json({ message: 'Logout successful' });
  });
});

// ---------- CURRENT USER ----------
// router.get('/current-user', (req, res) => {
//   if (req.session.userId) {
//     res.json({ user: { id: req.session.userId, name: req.session.userName, email: req.session.email } });
//   } else {
//     res.status(401).json({ message: 'Not logged in' });
//   }
// });

module.exports = router;
