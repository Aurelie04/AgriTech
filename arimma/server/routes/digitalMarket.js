const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this points to your MySQL DB connection
const multer = require('multer');
const path = require('path');

// Configure multer to store uploaded files in "uploads/" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST - create a new digital market listing with file upload
router.post('/', upload.single('contract_file'), (req, res) => {
  const userId = req.session.userId; // Use session to get logged-in user
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }

  const { product_name, quantity, price, buyer_type, verified } = req.body;

  // Validate required fields
  if (!product_name || !quantity || !price || !buyer_type) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const contract_file = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO digital_market
    (product_name, quantity, price, buyer_type, verified, user_id, contract_file)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    product_name,
    quantity,
    price,
    buyer_type,
    verified || false,
    userId,
    contract_file
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting listing:", err);
      return res.status(500).json({ message: 'Server error while creating listing.' });
    }

    return res.status(201).json({
      message: 'Listing created successfully.',
      listing_id: result.insertId
    });
  });
});

// GET - fetch listings only for the logged-in user
router.get('/', (req, res) => {
  const userId = req.session.userId; // Use correct session property

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user session found.' });
  }

  const sql = 'SELECT * FROM digital_market WHERE user_id = ? ORDER BY id DESC';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching listings:", err);
      return res.status(500).json({ message: 'Server error while fetching listings.' });
    }

    return res.status(200).json(results);
  });
});

module.exports = router;
