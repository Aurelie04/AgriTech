const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db'); 

// Ensure uploads/crops folder exists
const uploadDir = path.join(__dirname, '../uploads/crops');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Middleware to check if logged in - FIXED to use userId
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Add crop
router.post('/', isAuthenticated, upload.single('image'), (req, res) => {
  const { name, category, description } = req.body;
  const user_id = req.session.userId;

  // Image URL for frontend
  const image_url = req.file 
  ? `${req.protocol}://${req.get('host')}/uploads/crops/${req.file.filename}`
  : null;


  db.query(
    'INSERT INTO crops (user_id, name, category, description, image_url) VALUES (?, ?, ?, ?, ?)',
    [user_id, name, category, description, image_url],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Crop added successfully' });
    }
  );
});

// Get crops for logged-in user (with search)
router.get('/', isAuthenticated, (req, res) => {
  const user_id = req.session.userId;
  const search = req.query.search || '';
  
  db.query(
    'SELECT * FROM crops WHERE user_id = ? AND name LIKE ? ORDER BY created_at DESC',
    [user_id, `%${search}%`],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

// Delete crop
router.delete('/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const user_id = req.session.userId;

  db.query(
    'DELETE FROM crops WHERE id = ? AND user_id = ?',
    [id, user_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Crop deleted successfully' });
    }
  );
});

module.exports = router;
