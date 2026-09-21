-- ============================================
-- CHAISHALA - Tea Shop Database Schema
-- MariaDB / MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS chaishala_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chaishala_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tea Categories Table
CREATE TABLE IF NOT EXISTS tea_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tea Varieties Table
CREATE TABLE IF NOT EXISTS teas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  image_url VARCHAR(500),
  stock INT DEFAULT 100,
  weight VARCHAR(50) DEFAULT '100g',
  origin VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 4.5,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES tea_categories(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'preparing', 'ready', 'served', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  tea_id INT NOT NULL,
  tea_name VARCHAR(150) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (tea_id) REFERENCES teas(id) ON DELETE RESTRICT
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('card', 'upi', 'netbanking', 'cash') DEFAULT 'card',
  status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  card_last4 VARCHAR(4),
  gateway_response TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  order_id INT NOT NULL UNIQUE,
  issued_date DATE NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Tea Categories
INSERT INTO tea_categories (name, slug, description) VALUES
('Black Tea', 'black-tea', 'Bold and robust teas with full oxidation'),
('Green Tea', 'green-tea', 'Light and refreshing unoxidized teas'),
('Masala Chai', 'masala-chai', 'Spiced Indian milk teas'),
('Herbal Tea', 'herbal-tea', 'Caffeine-free botanical blends'),
('Oolong Tea', 'oolong-tea', 'Partially oxidized teas with complex flavors'),
('White Tea', 'white-tea', 'Delicate minimally processed teas'),
('Darjeeling', 'darjeeling', 'Premium teas from Darjeeling hills'),
('Specialty', 'specialty', 'Unique and premium blends');

-- Tea Products
INSERT INTO teas (name, description, price, category_id, image_url, stock, weight, origin, rating, is_featured) VALUES
('Assam Gold Tea', 'Rich, malty and full-bodied black tea from the fertile plains of Assam. Perfect with milk.', 249.00, 1, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 150, '100g', 'Assam, India', 4.7, TRUE),
('Classic Green Tea', 'Fresh, grassy and light green tea loaded with antioxidants. Best enjoyed plain.', 199.00, 2, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', 200, '100g', 'Darjeeling, India', 4.5, TRUE),
('Masala Chai Mix', 'Traditional Indian spiced tea blend with ginger, cardamom, cinnamon and cloves.', 179.00, 3, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80', 180, '150g', 'Maharashtra, India', 4.9, TRUE),
('Chamomile Dream', 'Soothing herbal tea with chamomile flowers. Perfect bedtime relaxation blend.', 229.00, 4, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80', 120, '50g', 'Himachal Pradesh, India', 4.6, FALSE),
('Darjeeling First Flush', 'The champagne of teas. Delicate floral notes from the first spring harvest.', 599.00, 7, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 80, '100g', 'Darjeeling, India', 4.9, TRUE),
('Earl Grey Supreme', 'Classic black tea beautifully scented with bergamot orange oil.', 299.00, 1, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80', 130, '100g', 'Assam, India', 4.6, FALSE),
('Oolong Mountain', 'Semi-oxidized tea with rich floral and fruity notes. Complex flavor profile.', 449.00, 5, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', 90, '100g', 'Nilgiri, India', 4.7, FALSE),
('Silver Needle White Tea', 'Rare, delicate white tea made from young buds. Subtle sweetness.', 699.00, 6, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 60, '50g', 'Darjeeling, India', 4.8, TRUE),
('Ginger Lemon Zest', 'Invigorating herbal blend with fresh ginger, lemon peel and honey notes.', 189.00, 4, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', 160, '75g', 'Kerala, India', 4.5, FALSE),
('Kashmiri Kahwa', 'Premium Kashmiri green tea with saffron, almonds, cardamom and rose petals.', 499.00, 8, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80', 100, '100g', 'Kashmir, India', 4.8, TRUE),
('Tulsi Basil Tea', 'Sacred Indian holy basil tea. Stress-relieving adaptogenic herbal blend.', 159.00, 4, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 140, '75g', 'Uttarakhand, India', 4.4, FALSE),
('Rose Garden Black Tea', 'Fragrant black tea with rose petals. Romantic and aromatic blend.', 319.00, 8, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80', 110, '100g', 'Assam, India', 4.6, FALSE);

-- Admin User (password: Chaishala@123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@chaishala.com', '$2b$10$rQ8K.U3OGx7H1nTgWfG1/.K4W8gM4B8eW5qR9cJ2YLvM3cXdN0kBe', 'admin');

-- Note: The bcrypt hash above is for 'Chaishala@123'
-- The actual hash will be generated by the seed script
