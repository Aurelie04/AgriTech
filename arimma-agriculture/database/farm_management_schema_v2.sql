-- Farm Management Database Schema v2.0
-- Database: arimma_db
-- Created: 2025
-- Description: Complete schema for farm product management system

USE arimma_db;

-- Temporarily disable foreign key checks for clean table drops
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist (in correct order due to foreign keys)
-- Drop child tables first, then parent tables
DROP TABLE IF EXISTS product_categories_audit;
DROP TABLE IF EXISTS farm_products_audit;
DROP TABLE IF EXISTS product_search_history;
DROP TABLE IF EXISTS product_views;
DROP TABLE IF EXISTS product_inquiries;
DROP TABLE IF EXISTS product_favorites;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS farm_products;
DROP TABLE IF EXISTS product_categories;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Product categories table
CREATE TABLE product_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📦', -- emoji or icon class
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Farm products table
CREATE TABLE farm_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'kg', -- kg, lbs, pieces, dozen, liters, bunches
    image_url TEXT, -- Can store base64 data URLs or regular URLs
    status ENUM('available', 'out_of_stock', 'draft') DEFAULT 'available',
    location VARCHAR(255), -- farm location
    harvest_date DATE,
    expiry_date DATE,
    organic BOOLEAN DEFAULT FALSE,
    certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_created_at (created_at),
    INDEX idx_organic (organic),
    INDEX idx_certified (certified),
    FULLTEXT(title, description) -- for search functionality
);

-- Product images table (for multiple images per product)
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL, -- base64 data URL or regular URL
    image_type ENUM('primary', 'gallery') DEFAULT 'gallery',
    is_primary BOOLEAN DEFAULT FALSE,
    file_size INT, -- file size in bytes
    mime_type VARCHAR(100), -- image/jpeg, image/png, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_image_type (image_type)
);

-- Product reviews and ratings table
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- Product favorites/wishlist table
CREATE TABLE product_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_favorite (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- Product inquiries/messages table
CREATE TABLE product_inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('pending', 'replied', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_status (status)
);

-- Product views/analytics table
CREATE TABLE product_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NULL, -- NULL for anonymous views
    ip_address VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at)
);

-- Product search history table
CREATE TABLE product_search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- NULL for anonymous searches
    search_term VARCHAR(255) NOT NULL,
    filters JSON, -- Store search filters as JSON
    results_count INT DEFAULT 0,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_search_term (search_term),
    INDEX idx_searched_at (searched_at)
);

-- Product categories audit log
CREATE TABLE product_categories_audit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    action ENUM('created', 'updated', 'deleted') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT NULL, -- Allow NULL for system operations
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
);

-- Product audit log
CREATE TABLE farm_products_audit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    action ENUM('created', 'updated', 'deleted', 'status_changed') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT NULL, -- Allow NULL for system operations
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES farm_products(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
);

-- Create triggers for audit logging
DELIMITER //

-- Trigger for product categories audit
CREATE TRIGGER product_categories_audit_insert
    AFTER INSERT ON product_categories
    FOR EACH ROW
BEGIN
    INSERT INTO product_categories_audit (category_id, action, new_values, changed_by)
    VALUES (NEW.id, 'created', JSON_OBJECT(
        'name', NEW.name,
        'description', NEW.description,
        'icon', NEW.icon,
        'is_active', NEW.is_active
    ), NULL); -- System operation, no specific user
END//

CREATE TRIGGER product_categories_audit_update
    AFTER UPDATE ON product_categories
    FOR EACH ROW
BEGIN
    INSERT INTO product_categories_audit (category_id, action, old_values, new_values, changed_by)
    VALUES (NEW.id, 'updated', JSON_OBJECT(
        'name', OLD.name,
        'description', OLD.description,
        'icon', OLD.icon,
        'is_active', OLD.is_active
    ), JSON_OBJECT(
        'name', NEW.name,
        'description', NEW.description,
        'icon', NEW.icon,
        'is_active', NEW.is_active
    ), NULL); -- System operation, no specific user
END//

-- Trigger for farm products audit
CREATE TRIGGER farm_products_audit_insert
    AFTER INSERT ON farm_products
    FOR EACH ROW
BEGIN
    INSERT INTO farm_products_audit (product_id, action, new_values, changed_by)
    VALUES (NEW.id, 'created', JSON_OBJECT(
        'title', NEW.title,
        'description', NEW.description,
        'category_id', NEW.category_id,
        'price', NEW.price,
        'quantity', NEW.quantity,
        'unit', NEW.unit,
        'status', NEW.status,
        'location', NEW.location,
        'organic', NEW.organic,
        'certified', NEW.certified
    ), NEW.user_id); -- Use the actual user_id from the product
END//

CREATE TRIGGER farm_products_audit_update
    AFTER UPDATE ON farm_products
    FOR EACH ROW
BEGIN
    INSERT INTO farm_products_audit (product_id, action, old_values, new_values, changed_by)
    VALUES (NEW.id, 'updated', JSON_OBJECT(
        'title', OLD.title,
        'description', OLD.description,
        'category_id', OLD.category_id,
        'price', OLD.price,
        'quantity', OLD.quantity,
        'unit', OLD.unit,
        'status', OLD.status,
        'location', OLD.location,
        'organic', OLD.organic,
        'certified', OLD.certified
    ), JSON_OBJECT(
        'title', NEW.title,
        'description', NEW.description,
        'category_id', NEW.category_id,
        'price', NEW.price,
        'quantity', NEW.quantity,
        'unit', NEW.unit,
        'status', NEW.status,
        'location', NEW.location,
        'organic', NEW.organic,
        'certified', NEW.certified
    ), NEW.user_id); -- Use the actual user_id from the product
END//

DELIMITER ;

-- Drop existing views if they exist
DROP VIEW IF EXISTS product_summary;
DROP VIEW IF EXISTS category_stats;

-- Create views for common queries
CREATE VIEW product_summary AS
SELECT 
    fp.id,
    fp.title,
    fp.price,
    fp.quantity,
    fp.unit,
    fp.status,
    fp.organic,
    fp.certified,
    fp.created_at,
    pc.name as category_name,
    pc.icon as category_icon,
    u.email as seller_email,
    up.first_name as seller_first_name,
    up.last_name as seller_last_name,
    up.business_name as seller_business,
    up.city as seller_city,
    up.state as seller_state,
    COALESCE(AVG(pr.rating), 0) as average_rating,
    COUNT(pr.id) as review_count,
    COUNT(pv.id) as view_count
FROM farm_products fp
JOIN product_categories pc ON fp.category_id = pc.id
JOIN users u ON fp.user_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN product_reviews pr ON fp.id = pr.product_id
LEFT JOIN product_views pv ON fp.id = pv.product_id
WHERE fp.status = 'available'
GROUP BY fp.id;

CREATE VIEW category_stats AS
SELECT 
    pc.id,
    pc.name,
    pc.icon,
    COUNT(fp.id) as product_count,
    AVG(fp.price) as average_price,
    MIN(fp.price) as min_price,
    MAX(fp.price) as max_price
FROM product_categories pc
LEFT JOIN farm_products fp ON pc.id = fp.category_id AND fp.status = 'available'
GROUP BY pc.id;

-- Insert some default categories (optional - can be removed for completely empty start)
INSERT INTO product_categories (name, description, icon) VALUES 
('Vegetables', 'Fresh vegetables and leafy greens', '🥬'),
('Fruits', 'Seasonal fruits and berries', '🍎'),
('Grains', 'Cereals, rice, wheat, and other grains', '🌾'),
('Livestock', 'Cattle, poultry, and other farm animals', '🐄'),
('Dairy Products', 'Milk, cheese, and dairy items', '🥛'),
('Herbs & Spices', 'Fresh and dried herbs and spices', '🌿'),
('Nuts & Seeds', 'Tree nuts, seeds, and legumes', '🥜'),
('Flowers & Plants', 'Ornamental plants and flowers', '🌸'),
('Organic Products', 'Certified organic agricultural products', '🌱'),
('Processed Foods', 'Jams, pickles, and other processed items', '🍯');

-- Create indexes for better performance
-- Note: Using prefix indexes for text columns to avoid key length limits
CREATE INDEX idx_farm_products_title ON farm_products(title(100));
CREATE INDEX idx_farm_products_price_range ON farm_products(price, status);
CREATE INDEX idx_farm_products_user_status ON farm_products(user_id, status);
CREATE INDEX idx_farm_products_category_status ON farm_products(category_id, status);
CREATE INDEX idx_farm_products_organic ON farm_products(organic, status);
CREATE INDEX idx_farm_products_certified ON farm_products(certified, status);
CREATE INDEX idx_farm_products_created_at ON farm_products(created_at DESC);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating, created_at);
CREATE INDEX idx_product_views_recent ON product_views(product_id, viewed_at);
CREATE INDEX idx_product_categories_name ON product_categories(name);
CREATE INDEX idx_user_profiles_city_state ON user_profiles(city, state);

-- Grant permissions (adjust as needed for your MySQL setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON arimma_db.* TO 'your_app_user'@'localhost';

-- Schema creation completed
SELECT 'Farm Management Database Schema v2.0 created successfully!' as status;
