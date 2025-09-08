import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arimma_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Mock data for testing when database is not available
const mockUsers = [
  {
    id: 1,
    email: 'farmer@arimma.com',
    password_hash: '$2b$10$example_hash_farmer',
    role: 'farmer',
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'buyer@arimma.com',
    password_hash: '$2b$10$example_hash_buyer',
    role: 'buyer',
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    email: 'trader@arimma.com',
    password_hash: '$2b$10$example_hash_trader',
    role: 'trader',
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    email: 'financier@arimma.com',
    password_hash: '$2b$10$example_hash_financier',
    role: 'financier',
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    email: 'logistics@arimma.com',
    password_hash: '$2b$10$example_hash_logistics',
    role: 'logistics',
    is_active: true,
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let pool: mysql.Pool | null = null;
let useMockData = false;

// Initialize database connection
async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    useMockData = false;
    return true;
  } catch (error) {
    console.error('❌ Database connection failed, using mock data:', error);
    useMockData = true;
    return false;
  }
}

// Test database connection
export async function testConnection() {
  if (!pool) {
    return await initializeDatabase();
  }
  
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    useMockData = false;
    return true;
  } catch (error) {
    console.error('❌ Database connection failed, using mock data:', error);
    useMockData = true;
    return false;
  }
}

// Execute query with error handling
export async function executeQuery(query: string, params: any[] = []) {
  if (useMockData) {
    console.log('Using mock data for query:', query);
    return handleMockQuery(query, params);
  }

  if (!pool) {
    await initializeDatabase();
  }

  try {
    const [rows] = await pool!.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Handle mock queries for testing
function handleMockQuery(query: string, params: any[] = []) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('select') && lowerQuery.includes('users') && lowerQuery.includes('email')) {
    const email = params[0];
    const user = mockUsers.find(u => u.email === email);
    return user ? [user] : [];
  }
  
  if (lowerQuery.includes('select') && lowerQuery.includes('users') && lowerQuery.includes('id')) {
    const id = params[0];
    const user = mockUsers.find(u => u.id === id);
    return user ? [user] : [];
  }
  
  if (lowerQuery.includes('insert') && lowerQuery.includes('users')) {
    const newUser = {
      id: mockUsers.length + 1,
      email: params[0],
      password_hash: params[1],
      role: params[2],
      is_active: true,
      email_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { insertId: newUser.id };
  }
  
  if (lowerQuery.includes('select') && lowerQuery.includes('user_profiles')) {
    return []; // No profiles in mock data
  }
  
  if (lowerQuery.includes('insert') && lowerQuery.includes('user_profiles')) {
    return { insertId: 1 };
  }
  
  if (lowerQuery.includes('update') && lowerQuery.includes('user_profiles')) {
    return { affectedRows: 1 };
  }
  
  return [];
}

// Get connection from pool
export async function getConnection() {
  if (!pool) {
    await initializeDatabase();
  }
  return await pool!.getConnection();
}

// Close all connections
export async function closePool() {
  if (pool) {
    await pool.end();
  }
}

export default pool;
