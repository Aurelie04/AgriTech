// Database Configuration
// Copy this to .env.local and update with your actual values

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arimma_db',
  port: parseInt(process.env.DB_PORT || '3306'),
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// Instructions:
// 1. Create a .env.local file in the root directory
// 2. Add the following variables:
//    DB_HOST=localhost
//    DB_USER=root
//    DB_PASSWORD=your_mysql_password
//    DB_NAME=arimma_db
//    DB_PORT=3306
//    JWT_SECRET=your-super-secret-jwt-key-change-in-production
//    JWT_EXPIRES_IN=7d
