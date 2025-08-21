const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust if your DB connection is exported differently

// Apply for loan
router.post("/loan/apply", (req, res) => {
  const { farmer_id, loan_type, principal_amount, interest_rate, due_date, partner } = req.body;

  const sql = `
    INSERT INTO loans 
    (farmer_id, loan_type, principal_amount, interest_rate, disbursement_date, due_date, partner, status)
    VALUES (?, ?, ?, ?, NOW(), ?, ?, 'pending')
  `;

  db.query(sql, [farmer_id, loan_type, principal_amount, interest_rate, due_date, partner], (err, result) => {
    if (err) {
      console.error("Loan application failed:", err);
      return res.status(500).json({ error: "Loan application failed" });
    }
    res.json({ success: true, loanId: result.insertId });
  });
});

// Fetch farmer loans
router.get("/loan/:farmerId", (req, res) => {
  const sql = "SELECT * FROM loans WHERE farmer_id = ?";
  db.query(sql, [req.params.farmerId], (err, results) => {
    if (err) {
      console.error("Error fetching loans:", err);
      return res.status(500).json({ error: "Error fetching loans" });
    }
    res.json(results);
  });
});

// Repayment
router.post("/loan/:loanId/repay", (req, res) => {
  const { amount, method } = req.body;

  const sql = `
    INSERT INTO repayments (loan_id, amount, repayment_date, method)
    VALUES (?, ?, NOW(), ?)
  `;

  db.query(sql, [req.params.loanId, amount, method], (err) => {
    if (err) {
      console.error("Repayment failed:", err);
      return res.status(500).json({ error: "Repayment failed" });
    }
    res.json({ message: "Repayment recorded successfully" });
  });
});

module.exports = router;
