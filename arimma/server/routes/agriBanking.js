const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agritechdb",
});

db.connect((err) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("✅ Connected to MySQL (agribanking.js)");
});

// Middleware: require login
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Get or create wallet
router.get("/wallet/me", requireLogin, async (req, res) => {
  const farmerId = req.session.userId;

  try {
    let [wallets] = await db.promise().query(
      "SELECT * FROM wallets WHERE farmer_id = ?",
      [farmerId]
    );

    if (wallets.length === 0) {
      await db.promise().query(
        "INSERT INTO wallets (farmer_id, balance) VALUES (?, 0)",
        [farmerId]
      );
      [wallets] = await db.promise().query(
        "SELECT * FROM wallets WHERE farmer_id = ?",
        [farmerId]
      );
    }

    res.json({ success: true, wallet: wallets[0] });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all transactions for logged-in farmer
router.get("/wallet/me/transactions", requireLogin, async (req, res) => {
  const farmerId = req.session.userId;

  try {
    const [transactions] = await db.promise().query(
      "SELECT * FROM transactions WHERE farmer_id = ? ORDER BY created_at DESC",
      [farmerId]
    );
    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Transaction fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Deposit
router.post("/wallet/deposit", requireLogin, async (req, res) => {
  const farmerId = req.session.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid deposit amount" });

  try {
    // Update wallet
    await db.promise().query(
      "UPDATE wallets SET balance = balance + ? WHERE farmer_id = ?",
      [amount, farmerId]
    );

    // Insert transaction
    const transactionId = uuidv4();
    await db.promise().query(
      "INSERT INTO transactions (farmer_id, amount, type, created_at) VALUES (?, ?, 'deposit', NOW())",
      [farmerId, amount]
    );

    res.json({ success: true, message: "Deposit successful", transactionId });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Withdraw
router.post("/wallet/withdraw", requireLogin, async (req, res) => {
  const farmerId = req.session.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid withdraw amount" });

  try {
    const [wallets] = await db.promise().query(
      "SELECT * FROM wallets WHERE farmer_id = ?",
      [farmerId]
    );

    if (wallets.length === 0) return res.status(400).json({ error: "Wallet not found" });

    const wallet = wallets[0];
    if (wallet.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    await db.promise().query(
      "UPDATE wallets SET balance = balance - ? WHERE farmer_id = ?",
      [amount, farmerId]
    );

    const transactionId = uuidv4();
    await db.promise().query(
      "INSERT INTO transactions (farmer_id, amount, type, created_at) VALUES (?, ?, 'withdraw', NOW())",
      [farmerId, amount]
    );

    res.json({ success: true, message: "Withdrawal successful", transactionId });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
