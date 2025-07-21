const db = require('../db'); // Make sure this points to your DB connection module

// Handle solar finance application submission
exports.submitApplication = (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    customerType,
    systemSize,
    financingOption,
    message,
  } = req.body;

  // Basic validation
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  const query = `
    INSERT INTO solar_finance_applications
    (name, email, phone, address, customer_type, system_size, financing_option, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    email,
    phone,
    address,
    customerType || '',
    systemSize || '',
    financingOption || '',
    message || '',
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error inserting application:', err.message);
      return res.status(500).json({ error: 'An error occurred while saving the application.' });
    }

    return res.status(200).json({
      message: 'Application submitted successfully.',
      applicationId: this.lastID
    });
  });
};
