-- Insurance Products Database Schema
-- Database: arimma_db

USE arimma_db;

-- Insurance product categories
CREATE TABLE insurance_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance products
CREATE TABLE insurance_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    coverage_type ENUM('crop', 'asset', 'weather_indexed', 'bundled') NOT NULL,
    premium_rate DECIMAL(5,4), -- percentage
    coverage_amount DECIMAL(15,2),
    deductible DECIMAL(15,2),
    policy_term_months INT DEFAULT 12,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES insurance_categories(id),
    INDEX idx_coverage_type (coverage_type),
    INDEX idx_is_active (is_active)
);

-- User insurance policies
CREATE TABLE user_insurance_policies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium_amount DECIMAL(15,2) NOT NULL,
    deductible_amount DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    payment_status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES insurance_products(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_policy_number (policy_number)
);

-- Insurance claims
CREATE TABLE insurance_claims (
    id INT PRIMARY KEY AUTO_INCREMENT,
    policy_id INT NOT NULL,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    claim_type ENUM('crop_damage', 'asset_damage', 'weather_loss', 'other') NOT NULL,
    incident_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    description TEXT NOT NULL,
    estimated_loss DECIMAL(15,2),
    claim_amount DECIMAL(15,2),
    status ENUM('submitted', 'under_review', 'approved', 'rejected', 'paid') DEFAULT 'submitted',
    adjuster_notes TEXT,
    supporting_documents JSON, -- Array of document URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (policy_id) REFERENCES user_insurance_policies(id),
    INDEX idx_policy_id (policy_id),
    INDEX idx_status (status),
    INDEX idx_claim_number (claim_number)
);

-- Bundled insurance packages
CREATE TABLE bundled_insurance_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_products JSON NOT NULL, -- Array of product IDs
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_is_active (is_active)
);

-- Insurance requests (for email integration)
CREATE TABLE insurance_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    request_type ENUM('quote', 'claim', 'policy_update', 'general_inquiry') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_request_type (request_type)
);

-- Sample data
INSERT INTO insurance_categories (name, description) VALUES 
('Crop Insurance', 'Protection against crop losses due to weather, pests, and diseases'),
('Asset Insurance', 'Coverage for agricultural equipment, buildings, and livestock'),
('Weather Indexed', 'Insurance based on weather parameters and indices'),
('Bundled Packages', 'Combined insurance products with discounts');

INSERT INTO insurance_products (category_id, name, description, coverage_type, premium_rate, coverage_amount, deductible, policy_term_months) VALUES 
-- Crop Insurance
(1, 'Basic Crop Protection', 'Protection against drought, flood, and pest damage for major crops', 'crop', 0.025, 100000.00, 5000.00, 12),
(1, 'Premium Crop Coverage', 'Comprehensive coverage including disease and market price protection', 'crop', 0.035, 250000.00, 10000.00, 12),
(1, 'Organic Crop Insurance', 'Specialized coverage for organic farming with higher premiums', 'crop', 0.045, 150000.00, 7500.00, 12),

-- Asset Insurance
(2, 'Equipment Protection', 'Coverage for tractors, harvesters, and farm machinery', 'asset', 0.015, 500000.00, 2500.00, 12),
(2, 'Building Insurance', 'Protection for barns, storage facilities, and farm buildings', 'asset', 0.020, 1000000.00, 10000.00, 12),
(2, 'Livestock Insurance', 'Coverage for cattle, poultry, and other farm animals', 'asset', 0.030, 200000.00, 5000.00, 12),

-- Weather Indexed
(3, 'Rainfall Index Insurance', 'Protection based on rainfall measurements in your area', 'weather_indexed', 0.020, 75000.00, 3000.00, 12),
(3, 'Temperature Index Coverage', 'Insurance based on temperature extremes affecting crops', 'weather_indexed', 0.025, 100000.00, 4000.00, 12),
(3, 'Drought Index Protection', 'Coverage triggered by drought index measurements', 'weather_indexed', 0.030, 125000.00, 5000.00, 12);

INSERT INTO bundled_insurance_packages (name, description, base_products, discount_percentage) VALUES 
('Complete Farm Protection', 'Crop + Asset + Weather coverage with 15% discount', '[1, 4, 7]', 15.00),
('Equipment & Crop Bundle', 'Equipment and crop insurance with 10% discount', '[1, 4]', 10.00),
('Weather & Asset Package', 'Weather indexed and asset insurance with 12% discount', '[4, 7]', 12.00);
