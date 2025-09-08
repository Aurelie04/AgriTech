const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const db = require('./db');
const path = require('path');

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  name: 'arimma.sid',
  secret: 'your-secret-key', // Change in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1 hour
  },
}));

// ---------- AUTH MIDDLEWARE ----------
const requireLogin = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  next();
};

// ---------- ROUTES ----------
app.use('/api/auth', authRoutes);

// ---------- PROTECTED ROUTES ----------
app.get('/api/protected', requireLogin, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session.userName });
});

// ---------- PROFILE ----------
app.get('/api/farmer/profile', requireLogin, async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM farmers WHERE id = ?', [req.session.userId]);
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/farmer/profile', requireLogin, async (req, res) => {
  const { name, phone, address, business } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE farmers SET name = ?, phone = ?, address = ?, business = ?, updated_at = NOW() WHERE id = ?',
      [name, phone, address, business, req.session.userId]
    );
    if (result.affectedRows === 0) return res.status(400).json({ error: 'No changes made.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---------- CURRENT USER ----------
app.get('/api/current-user', requireLogin, (req, res) => {
  res.json({ user: { id: req.session.userId, name: req.session.userName, email: req.session.email } });
});

// ---------- YIELD ROUTE ----------
app.get('/api/yield/tomatoes', (req, res) => {
  const yieldData = [
    { month: 'Jan', harvest: 120, revenue: 1000 },
    { month: 'Feb', harvest: 150, revenue: 1300 },
    { month: 'Mar', harvest: 200, revenue: 1700 },
    { month: 'Apr', harvest: 250, revenue: 2100 },
    { month: 'May', harvest: 300, revenue: 2600 },
  ];
  res.json({ title: 'Top Best-seller product', crop: 'Tomatoes', yieldData });
});

// ---------- OTHER ROUTES ----------
app.use('/api/solar-finance', require('./routes/solarFinanceRoutes'));
app.use('/api/exchange', require('./routes/exchangeApi'));
app.use('/api/digital-market', require('./routes/digitalMarket'));
app.use('/api/agri-banking', require('./routes/agriBanking'));
app.use('/api/agri-finance', require('./routes/agriFinance'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
app.use('/api/commodity-prices', require('./routes/priceRoutes'));
app.use('/api/commodities', require('./routes/commodities'));

// ---------- START SERVER ----------
app.listen(8081, () => {
  console.log('Server running on port 8081');
});
