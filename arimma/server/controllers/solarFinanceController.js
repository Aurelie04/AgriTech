const db = require('../db');

// Create a new solar finance application
exports.createApplication = (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    customerType,
    systemSize,
    financingOption,
    message
  } = req.body;

  const sql = `INSERT INTO solar_finance_applications 
    (name, phone, email, address, customerType, systemSize, financingOption, message) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, phone, email, address, customerType, systemSize, financingOption, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Application submitted successfully' });
  });
};

// Get all solar finance applications
exports.getAllApplications = (req, res) => {
  db.query('SELECT * FROM solar_finance_applications', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get a specific application by ID
exports.getApplicationById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM solar_finance_applications WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(results[0]);
  });
};

// Delete an application by ID
exports.deleteApplication = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM solar_finance_applications WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Application deleted successfully' });
  });
};
