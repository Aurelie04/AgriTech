const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agritechdb'
});

// Controller route for solar finance
const solarFinanceRoutes = require('./routes/solarFinanceRoutes');
app.use('/api/solar-finance', solarFinanceRoutes); // Correct route prefix

// ---------------- Existing Endpoints ------------------

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, address, business, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const [existing] = await db.promise().query('SELECT * FROM farmers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query(
      `INSERT INTO farmers (name, email, password, phone, address, business, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, hashedPassword, phone || '', address || '', business || '', role || 'farmer']
    );

    res.json({ message: 'Farmer registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM farmers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// Forgot Password
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  db.query('SELECT * FROM farmers WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Email not found' });

    const token = uuidv4();
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    db.query('UPDATE farmers SET reset_token = ? WHERE email = ?', [token, email], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to save reset token' });
      res.json({ message: 'Reset link generated.', resetLink });
    });
  });
});

// Reset Password
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: 'New password is required.' });

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM farmers WHERE reset_token = ? AND reset_token_expiration > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().query(
      'UPDATE farmers SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset Password error:', err);
    res.status(500).json({ message: 'Server error during password reset.' });
  }
});

// Yield Data
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

// Equipment booking
app.post('/api/equipment/request', (req, res) => {
  const { userId, equipment_name, purpose, date_from, date_to } = req.body;
  const sql = `INSERT INTO equipment_requests (user_id, equipment_name, purpose, date_from, date_to) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [userId, equipment_name, purpose, date_from, date_to], (err, result) => {
    if (err) return res.status(500).send("Failed to book equipment");
    res.status(200).send("Booking successful");
  });
});

// Farmer profile
app.get('/api/farmer/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM farmers WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Farmer not found' });
    res.json(results[0]);
  });
});

// Update profile
app.put('/api/farmer/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, address, business } = req.body;
  db.query(
    'UPDATE farmers SET name = ?, phone = ?, address = ?, business = ? WHERE id = ?',
    [name, phone, address, business, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Insurance Request
app.post('/api/insurance/apply', (req, res) => {
  const { fullName, type, bundle, description } = req.body;
  const sql = `INSERT INTO insurance_requests (full_name, insurance_type, bundle, description) VALUES (?, ?, ?, ?)`;
  db.query(sql, [fullName, type, bundle, description], (err, result) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });
    res.status(200).json({ message: 'Insurance request submitted successfully' });
  });
});

// General Market Listings
app.get('/api/market', (req, res) => {
  db.query('SELECT * FROM market_listings', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Digital Market Listing
app.post('/api/digital-market', (req, res) => {
  const { user_id, product_name, quantity, price, buyer_type, verified, contract_link } = req.body;
  const sql = `
    INSERT INTO digital_market_listings 
    (user_id, product_name, quantity, price, buyer_type, verified, contract_link) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, product_name, quantity, price, buyer_type, verified, contract_link], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product listed in the Digital Market!' });
  });
});

// Digital Market Fetch
app.get('/api/digital-market', (req, res) => {
  db.query('SELECT * FROM digital_market_listings', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch listings' });
    res.json(results);
  });
});

// Existing solar apply route (can be phased out in favor of controller)
app.post('/api/solar/apply', (req, res) => {
  const {
    name, email, phone, property_type,
    location, package_type, finance_model, monthly_income
  } = req.body;

  const sql = `INSERT INTO solar_finance_applications
    (name, email, phone, property_type, location, package_type, finance_model, monthly_income)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, phone, property_type, location, package_type, finance_model, monthly_income],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ success: true, message: "Application submitted" });
    });
});

// Server Start
app.listen(8081, () => {
  console.log('Server running on port 8081');
});
