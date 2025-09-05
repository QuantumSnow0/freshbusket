-- FreshBasket Database Setup Script
-- Run this in your Supabase SQL Editor to set up the complete database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  delivery_address TEXT NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Orders are private to the user
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample products
INSERT INTO products (name, price, description, image_url, category, stock_quantity) VALUES
-- Fruits
('Fresh Bananas', 2.99, 'Sweet and ripe bananas, perfect for snacking or baking', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 'Fruits', 50),
('Red Apples', 3.49, 'Crisp and juicy red apples, great for eating fresh', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 'Fruits', 30),
('Oranges', 2.79, 'Fresh citrus oranges, packed with vitamin C', 'https://images.unsplash.com/photo-1557800634-7bf3c73bfab5?w=400', 'Fruits', 40),
('Strawberries', 4.99, 'Sweet and juicy strawberries, perfect for desserts', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 'Fruits', 25),

-- Vegetables
('Fresh Carrots', 1.99, 'Crunchy and nutritious carrots, great for cooking', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'Vegetables', 60),
('Broccoli', 2.49, 'Fresh green broccoli, perfect for healthy meals', 'https://images.unsplash.com/photo-1438118907701-94360ffc0e54?w=400', 'Vegetables', 35),
('Spinach', 1.79, 'Fresh leafy spinach, rich in iron and vitamins', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 'Vegetables', 45),
('Tomatoes', 2.29, 'Ripe red tomatoes, perfect for salads and cooking', 'https://images.unsplash.com/photo-1546470427-5c8d2e2e8c4b?w=400', 'Vegetables', 55),

-- Dairy
('Whole Milk', 3.99, 'Fresh whole milk, 1 gallon', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 'Dairy', 20),
('Cheddar Cheese', 4.49, 'Sharp cheddar cheese, 8 oz block', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'Dairy', 15),
('Greek Yogurt', 2.99, 'Creamy Greek yogurt, 32 oz container', 'https://images.unsplash.com/photo-1571212515410-2aef33a6b9b0?w=400', 'Dairy', 25),
('Butter', 2.79, 'Unsalted butter, 1 lb', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'Dairy', 30),

-- Meat & Seafood
('Chicken Breast', 6.99, 'Fresh boneless chicken breast, 1 lb', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 'Meat & Seafood', 20),
('Salmon Fillet', 12.99, 'Fresh Atlantic salmon fillet, 1 lb', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 'Meat & Seafood', 15),
('Ground Beef', 5.99, 'Fresh ground beef, 1 lb', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', 'Meat & Seafood', 25),

-- Pantry
('Brown Rice', 3.49, 'Organic brown rice, 2 lb bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'Pantry', 40),
('Pasta', 1.99, 'Whole wheat pasta, 1 lb box', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400', 'Pantry', 50),
('Olive Oil', 7.99, 'Extra virgin olive oil, 16 oz bottle', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 'Pantry', 20),
('Bread', 2.49, 'Fresh whole grain bread loaf', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'Pantry', 30),

-- Snacks
('Mixed Nuts', 5.99, 'Premium mixed nuts, 12 oz bag', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 'Snacks', 35),
('Dark Chocolate', 4.49, '70% dark chocolate bar, 3.5 oz', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', 'Snacks', 40);

-- Note: Test users and orders will be created when you register/login
-- The users table requires a valid auth.users.id, so we can't insert dummy data here

-- Verify the setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as order_count FROM orders;
