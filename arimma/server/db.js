const mysql = require('mysql2');


const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agritechdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = db;
