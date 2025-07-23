const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agritechdb'
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    process.exit(1);  // Exit if connection fails
  }
  console.log('Connected to MySQL');
});

// Export the connection object for use in other files
module.exports = connection;
