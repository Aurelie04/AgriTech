const express = require('express');
const router = express.Router();
const db = require('../db');
const QRCode = require('qrcode');

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// ✅ Get wallet for logged-in user (auto-create if missing)
router.get('/wallet/me', requireLogin, async (req, res) => {
  const userId = req.session.userId;

  try {
    let [rows] = await db.promise().query(
      'SELECT * FROM wallets WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      // Auto-create wallet with balance 0
      await db.promise().query(
        'INSERT INTO wallets (user_id, balance) VALUES (?, 0)',
        [userId]
      );

      [rows] = await db.promise().query(
        'SELECT * FROM wallets WHERE user_id = ?',
        [userId]
      );
    }

    res.json({ success: true, wallet: rows[0] });
  } catch (err) {
    console.error('Wallet fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get transactions for logged-in user’s wallet
router.get('/wallet/me/transactions', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  try {
    const [rows] = await db.promise().query(
      `SELECT t.*, w.user_id
       FROM transactions t
       JOIN wallets w ON t.wallet_id = w.id
       WHERE w.user_id = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );
    res.json({ success: true, transactions: rows });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate QR for a payment
router.post('/wallet/generate-qr', requireLogin, async (req, res) => {
  const { walletId, amount } = req.body;
  if (!walletId || !amount) return res.status(400).json({ message: 'walletId and amount are required' });

  try {
    const qrText = JSON.stringify({ walletId, amount });
    const qrDataUrl = await QRCode.toDataURL(qrText);
    res.json({ success: true, qr: qrDataUrl });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ message: 'Failed to generate QR' });
  }
});

module.exports = router;
