-- Marketplace Database Schema
-- Database: arimma_db
-- Created: 2025
-- Description: Complete schema for marketplace functionality including buyers, contracts, and trade analytics

USE arimma_db;

-- Temporarily disable foreign key checks for clean table drops
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS trade_analytics;
DROP TABLE IF EXISTS contract_documents;
DROP TABLE IF EXISTS digital_contracts;
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS marketplace_listings;
DROP TABLE IF EXISTS verified_buyers;
DROP TABLE IF EXISTS buyer_categories;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Buyer categories table
CREATE TABLE buyer_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT '🏢',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Verified buyers table (off-takers, processors, export buyers)
CREATE TABLE verified_buyers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_type ENUM('off_taker', 'processor', 'export_buyer', 'retailer', 'wholesaler') NOT NULL,
    category_id INT NOT NULL,
    license_number VARCHAR(100),
    registration_number VARCHAR(100),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'South Africa',
    website VARCHAR(255),
    verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'pending',
    verification_date TIMESTAMP NULL,
    verified_by INT NULL,
    verification_notes TEXT,
    annual_volume DECIMAL(15,2), -- Annual purchase volume in ZAR
    payment_terms VARCHAR(100), -- e.g., "30 days", "COD", "Advance"
    quality_requirements TEXT,
    preferred_products JSON, -- Array of preferred product types
    certifications JSON, -- Array of certifications (organic, fair trade, etc.)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES buyer_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_business_type (business_type),
    INDEX idx_verification_status (verification_status),
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_is_active (is_active)
);

-- Marketplace listings table (products for sale)
CREATE TABLE marketplace_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    description TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    price_per_unit DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    harvest_date DATE,
    expiry_date DATE,
    location VARCHAR(255),
    quality_grade ENUM('premium', 'standard', 'commercial') DEFAULT 'standard',
    organic BOOLEAN DEFAULT FALSE,
    certified BOOLEAN DEFAULT FALSE,
    certifications JSON, -- Array of certifications
    images JSON, -- Array of image URLs
    minimum_order DECIMAL(10,2),
    maximum_order DECIMAL(10,2),
    delivery_available BOOLEAN DEFAULT FALSE,
    delivery_radius INT, -- in kilometers
    delivery_cost DECIMAL(10,2),
    payment_methods JSON, -- Array of accepted payment methods
    listing_status ENUM('active', 'sold', 'expired', 'draft') DEFAULT 'active',
    views_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_seller_id (seller_id),
    INDEX idx_product_type (product_type),
    INDEX idx_listing_status (listing_status),
    INDEX idx_price_per_unit (price_per_unit),
    INDEX idx_created_at (created_at),
    INDEX idx_organic (organic),
    INDEX idx_certified (certified),
    FULLTEXT(product_name, description)
);

-- Price history table for dynamic price discovery
CREATE TABLE price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    location VARCHAR(255),
    price_per_unit DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    quality_grade ENUM('premium', 'standard', 'commercial') DEFAULT 'standard',
    organic BOOLEAN DEFAULT FALSE,
    source_type ENUM('listing', 'transaction', 'market_data') NOT NULL,
    source_id INT NULL, -- Reference to listing or transaction
    volume DECIMAL(10,2), -- Volume associated with this price
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_product_type (product_type),
    INDEX idx_location (location),
    INDEX idx_recorded_date (recorded_date),
    INDEX idx_price_per_unit (price_per_unit),
    INDEX idx_quality_grade (quality_grade),
    INDEX idx_organic (organic)
);

-- Digital contracts table
CREATE TABLE digital_contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    listing_id INT NULL, -- Reference to marketplace listing
    product_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    quality_specifications TEXT,
    delivery_terms TEXT,
    payment_terms VARCHAR(100),
    delivery_date DATE,
    delivery_address TEXT,
    contract_status ENUM('draft', 'pending_approval', 'approved', 'active', 'completed', 'cancelled', 'disputed') DEFAULT 'draft',
    signed_by_seller BOOLEAN DEFAULT FALSE,
    signed_by_buyer BOOLEAN DEFAULT FALSE,
    seller_signature_date TIMESTAMP NULL,
    buyer_signature_date TIMESTAMP NULL,
    contract_start_date DATE,
    contract_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE SET NULL,
    INDEX idx_seller_id (seller_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_contract_number (contract_number),
    INDEX idx_contract_status (contract_status),
    INDEX idx_created_at (created_at)
);

-- Contract documents table (for storing contract files)
CREATE TABLE contract_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT NOT NULL,
    document_type ENUM('contract', 'invoice', 'delivery_note', 'quality_certificate', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES digital_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_contract_id (contract_id),
    INDEX idx_document_type (document_type),
    INDEX idx_uploaded_at (uploaded_at)
);

-- Trade analytics table
CREATE TABLE trade_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT NOT NULL,
    transaction_type ENUM('sale', 'purchase', 'exchange') NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    location VARCHAR(255),
    quality_grade ENUM('premium', 'standard', 'commercial') DEFAULT 'standard',
    organic BOOLEAN DEFAULT FALSE,
    transaction_date DATE NOT NULL,
    completion_date DATE,
    payment_status ENUM('pending', 'partial', 'completed', 'overdue') DEFAULT 'pending',
    delivery_status ENUM('pending', 'in_transit', 'delivered', 'disputed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES digital_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_contract_id (contract_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_product_type (product_type),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_delivery_status (delivery_status)
);

-- Create views for common queries
DROP VIEW IF EXISTS marketplace_summary;
DROP VIEW IF EXISTS buyer_verification_summary;
DROP VIEW IF EXISTS price_analytics;

-- Marketplace summary view
CREATE VIEW marketplace_summary AS
SELECT 
    ml.id,
    ml.product_name,
    ml.product_type,
    ml.variety,
    ml.quantity,
    ml.unit,
    ml.price_per_unit,
    ml.currency,
    ml.quality_grade,
    ml.organic,
    ml.certified,
    ml.listing_status,
    ml.views_count,
    ml.inquiries_count,
    ml.created_at,
    u.email as seller_email,
    up.first_name as seller_first_name,
    up.last_name as seller_last_name,
    up.business_name as seller_business,
    up.city as seller_city,
    up.state as seller_state
FROM marketplace_listings ml
JOIN users u ON ml.seller_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE ml.listing_status = 'active';

-- Buyer verification summary view
CREATE VIEW buyer_verification_summary AS
SELECT 
    vb.id,
    vb.company_name,
    vb.business_type,
    vb.verification_status,
    vb.contact_person,
    vb.phone,
    vb.email,
    vb.city,
    vb.state,
    vb.annual_volume,
    vb.payment_terms,
    vb.created_at,
    bc.name as category_name,
    bc.icon as category_icon,
    u.email as user_email
FROM verified_buyers vb
JOIN buyer_categories bc ON vb.category_id = bc.id
JOIN users u ON vb.user_id = u.id
WHERE vb.is_active = TRUE;

-- Price analytics view
CREATE VIEW price_analytics AS
SELECT 
    product_type,
    variety,
    location,
    quality_grade,
    organic,
    AVG(price_per_unit) as avg_price,
    MIN(price_per_unit) as min_price,
    MAX(price_per_unit) as max_price,
    COUNT(*) as price_points,
    MAX(recorded_date) as latest_price_date
FROM price_history
WHERE recorded_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY product_type, variety, location, quality_grade, organic;

-- Insert default buyer categories
INSERT INTO buyer_categories (name, description, icon) VALUES 
('Food Processors', 'Companies that process raw agricultural products into food items', '🏭'),
('Export Companies', 'International buyers and export companies', '🌍'),
('Retail Chains', 'Supermarket chains and retail stores', '🏪'),
('Restaurants & Hotels', 'Food service industry buyers', '🍽️'),
('Wholesale Distributors', 'Bulk distributors and wholesalers', '📦'),
('Feed Manufacturers', 'Animal feed and pet food manufacturers', '🐄'),
('Beverage Companies', 'Juice, wine, and beverage manufacturers', '🥤'),
('Organic Buyers', 'Specialized organic product buyers', '🌱'),
('Government Agencies', 'Public sector procurement', '🏛️'),
('Cooperative Societies', 'Farmer cooperatives and associations', '🤝');

-- Create indexes for better performance
CREATE INDEX idx_marketplace_listings_search ON marketplace_listings(product_name, product_type);
CREATE INDEX idx_marketplace_listings_price_range ON marketplace_listings(price_per_unit, listing_status);
CREATE INDEX idx_verified_buyers_search ON verified_buyers(company_name, business_type);
CREATE INDEX idx_digital_contracts_status ON digital_contracts(contract_status, created_at);
CREATE INDEX idx_trade_analytics_date ON trade_analytics(transaction_date, completion_date);
CREATE INDEX idx_price_history_analytics ON price_history(product_type, recorded_date, price_per_unit);

-- Grant permissions (adjust as needed for your MySQL setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON arimma_db.* TO 'your_app_user'@'localhost';

-- Schema creation completed
SELECT 'Marketplace Database Schema created successfully!' as status;

