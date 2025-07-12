// ✅ Updated server.js (Express Backend)
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agritechdb'
});

// ✅ Register Endpoint (with full fields and bcrypt)
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

// ✅ Login Endpoint
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

app.listen(8081, () => console.log('Server running on port 8081'));
