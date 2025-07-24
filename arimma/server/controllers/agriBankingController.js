const db = require('../db');

exports.submitAgriBanking = (req, res) => {
  const { userId, accountType, diasporaWalletFor, amount, transactionReference } = req.body;

  console.log('AgriBanking Submission Body:', req.body);

  if (!userId?.toString().trim() || !accountType?.toString().trim() || !amount) {
    console.log('Validation failed due to missing fields:', { userId, accountType, amount });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `INSERT INTO agri_banking_transactions 
               (user_id, account_type, diaspora_wallet_for, amount, transaction_reference) 
               VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [userId, accountType, diasporaWalletFor, amount, transactionReference],
    (err, result) => {
      if (err) {
        console.error('Error inserting agri banking transaction:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      return res.status(200).json({ message: 'Transaction submitted successfully' });
    }
  );
};
