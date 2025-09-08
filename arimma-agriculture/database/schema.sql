-- Arimma Agriculture Database Schema
-- Database: arimma_db

CREATE DATABASE IF NOT EXISTS arimma_db;
USE arimma_db;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'buyer', 'trader', 'financier', 'logistics') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table with role-based fields
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    profile_image VARCHAR(500),
    
    -- Farmer specific fields
    farm_size DECIMAL(10,2), -- in hectares
    farm_location VARCHAR(255),
    crops_grown TEXT, -- JSON array of crops
    farming_experience INT, -- years
    certification VARCHAR(255),
    
    -- Buyer specific fields
    company_size ENUM('small', 'medium', 'large', 'enterprise'),
    purchase_volume DECIMAL(15,2), -- annual purchase volume
    preferred_crops TEXT, -- JSON array
    quality_requirements TEXT,
    
    -- Trader specific fields
    trading_license VARCHAR(255),
    market_specialization VARCHAR(255),
    trading_volume DECIMAL(15,2), -- annual trading volume
    export_import BOOLEAN DEFAULT FALSE,
    
    -- Financier specific fields
    institution_name VARCHAR(255),
    institution_type ENUM('bank', 'microfinance', 'cooperative', 'investor', 'other'),
    loan_capacity DECIMAL(15,2),
    interest_rate_range VARCHAR(50),
    collateral_requirements TEXT,
    
    -- Logistics specific fields
    transport_type ENUM('road', 'rail', 'air', 'sea', 'multimodal'),
    fleet_size INT,
    service_areas TEXT, -- JSON array of areas
    cold_storage BOOLEAN DEFAULT FALSE,
    insurance_coverage BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_business_type (business_type),
    INDEX idx_city (city),
    INDEX idx_state (state)
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- User sessions for JWT token management
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Sample data for testing
INSERT INTO users (email, password_hash, role) VALUES 
('farmer@arimma.com', '$2b$10$example_hash_farmer', 'farmer'),
('buyer@arimma.com', '$2b$10$example_hash_buyer', 'buyer'),
('trader@arimma.com', '$2b$10$example_hash_trader', 'trader'),
('financier@arimma.com', '$2b$10$example_hash_financier', 'financier'),
('logistics@arimma.com', '$2b$10$example_hash_logistics', 'logistics');

-- Sample profile data
INSERT INTO user_profiles (user_id, first_name, last_name, phone, city, state, business_name, business_type, farm_size, farm_location, crops_grown, farming_experience) VALUES 
(1, 'John', 'Doe', '+2348012345678', 'Lagos', 'Lagos', 'Doe Farms', 'Agriculture', 50.5, 'Ikorodu, Lagos', '["Rice", "Maize", "Cassava"]', 10);

INSERT INTO user_profiles (user_id, first_name, last_name, phone, city, state, business_name, business_type, company_size, purchase_volume, preferred_crops) VALUES 
(2, 'Jane', 'Smith', '+2348012345679', 'Abuja', 'FCT', 'Smith Foods Ltd', 'Food Processing', 'large', 5000000.00, '["Rice", "Wheat", "Maize"]');

INSERT INTO user_profiles (user_id, first_name, last_name, phone, city, state, business_name, business_type, trading_license, market_specialization, trading_volume) VALUES 
(3, 'Mike', 'Johnson', '+2348012345680', 'Kano', 'Kano', 'Johnson Trading Co', 'Commodity Trading', 'TRD/2024/001', 'Grains and Tubers', 10000000.00);

INSERT INTO user_profiles (user_id, first_name, last_name, phone, city, state, business_name, business_type, institution_name, institution_type, loan_capacity, interest_rate_range) VALUES 
(4, 'Sarah', 'Williams', '+2348012345681', 'Port Harcourt', 'Rivers', 'AgriFinance Bank', 'Banking', 'AgriFinance Bank', 'bank', 50000000.00, '12-18%');

INSERT INTO user_profiles (user_id, first_name, last_name, phone, city, state, business_name, business_type, transport_type, fleet_size, service_areas, cold_storage) VALUES 
(5, 'David', 'Brown', '+2348012345682', 'Ibadan', 'Oyo', 'Brown Logistics', 'Transportation', 'road', 25, '["South West", "North Central"]', TRUE);
