const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // ✅ Missing before

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());

app.use(session({
  name: 'arimma.sid',
  secret: 'your-secret-key', // Replace with a more secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false in development (production should be true with HTTPS)
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1 hour session expiration
  },
}));

// ---------- DB ----------
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agritechdb',
});

// ---------- AUTH MIDDLEWARE ----------
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  next();
};

// ---------- AUTH ROUTES ----------
app.use('/api/auth', authRoutes); // ✅ Moved up and added import

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

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM farmers WHERE email = ?';

  db.query(sql, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (data.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = data[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Store session info
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.email = user.email;

    console.log('Session created. ID:', req.sessionID);

    // Send the response with session info and user data
    res.json({
      message: 'Login successful',
      sessionId: req.sessionID,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});


app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('arimma.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// ---------- PASSWORD RESET ----------
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  db.query('SELECT * FROM farmers WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Email not found' });

    const token = uuidv4();
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    db.query('UPDATE farmers SET reset_token = ?, reset_token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?',
      [token, email], (err2) => {
        if (err2) return res.status(500).json({ message: 'Failed to save reset token' });
        res.json({ message: 'Reset link generated.', resetLink });
      });
  });
});

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

// ---------- PROFILE ----------
app.get('/api/farmer/profile', (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    db.query('SELECT * FROM farmers WHERE id = ?', [userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (results.length > 0) return res.json(results[0]);
      res.status(404).json({ error: 'User not found' });
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.put('/api/farmer/profile', (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    const { name, phone, address, business } = req.body;
    db.query(
      'UPDATE farmers SET name = ?, phone = ?, address = ?, business = ?, updated_at = NOW() WHERE id = ?',
      [name, phone, address, business, userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'DB error' });

        if (result.affectedRows === 0) {
          return res.status(400).json({ error: 'No changes made.' });
        }

        res.json({ success: true });
      }
    );
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ---------- OTHER ROUTES ----------
const agriBankingRoutes = require('./routes/agriBanking');
app.use('/api/agri-banking', agriBankingRoutes);

const solarFinanceRoutes = require('./routes/solarFinanceRoutes');
app.use('/api/solar-finance', solarFinanceRoutes);

const exchangeRoutes = require('./routes/exchangeApi');
app.use('/api/exchange', exchangeRoutes);

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

// ---------- PROTECTED ROUTES ----------
app.get('/api/protected', requireLogin, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session.userName });
});

app.post('/api/equipment/request', requireLogin, (req, res) => {
  const { equipment_name, purpose, date_from, date_to } = req.body;
  const userId = req.session.userId;

  const sql = `INSERT INTO equipment_requests (user_id, equipment_name, purpose, date_from, date_to) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [userId, equipment_name, purpose, date_from, date_to], (err, result) => {
    if (err) return res.status(500).send("Failed to book equipment");
    res.status(200).send("Booking successful");
  });
});

// ---------- START SERVER ----------
app.listen(8081, () => {
  console.log('Server running on port 8081');
});
