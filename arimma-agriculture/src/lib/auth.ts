import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface User {
  id: number;
  email: string;
  role: 'farmer' | 'buyer' | 'trader' | 'financier' | 'logistics';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  business_name?: string;
  business_type?: string;
  profile_image?: string;
  // Role-specific fields
  farm_size?: number;
  farm_location?: string;
  crops_grown?: string;
  farming_experience?: number;
  certification?: string;
  company_size?: string;
  purchase_volume?: number;
  preferred_crops?: string;
  quality_requirements?: string;
  trading_license?: string;
  market_specialization?: string;
  trading_volume?: number;
  export_import?: boolean;
  institution_name?: string;
  institution_type?: string;
  loan_capacity?: number;
  interest_rate_range?: string;
  collateral_requirements?: string;
  transport_type?: string;
  fleet_size?: number;
  service_areas?: string;
  cold_storage?: boolean;
  insurance_coverage?: boolean;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await executeQuery(query, [email]) as User[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await executeQuery(query, [id]) as User[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Create new user
export async function createUser(email: string, password: string, role: string): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(password);
    const query = `
      INSERT INTO users (email, password_hash, role) 
      VALUES (?, ?, ?)
    `;
    const result = await executeQuery(query, [email, hashedPassword, role]) as any;
    
    if (result.insertId) {
      return await getUserById(result.insertId);
    }
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Get user profile
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  try {
    const query = 'SELECT * FROM user_profiles WHERE user_id = ?';
    const result = await executeQuery(query, [userId]) as UserProfile[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Create user profile
export async function createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const fields = Object.keys(profileData).join(', ');
    const placeholders = Object.keys(profileData).map(() => '?').join(', ');
    const values = Object.values(profileData);
    
    const query = `
      INSERT INTO user_profiles (${fields}) 
      VALUES (${placeholders})
    `;
    
    const result = await executeQuery(query, values) as any;
    
    if (result.insertId) {
      return await getUserProfile(profileData.user_id!);
    }
    return null;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<boolean> {
  try {
    const fields = Object.keys(profileData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(profileData), userId];
    
    const query = `
      UPDATE user_profiles 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `;
    
    const result = await executeQuery(query, values) as any;
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Check if email exists
export async function emailExists(email: string): Promise<boolean> {
  try {
    const query = 'SELECT id FROM users WHERE email = ?';
    const result = await executeQuery(query, [email]) as any[];
    return result.length > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}
