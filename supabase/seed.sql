-- Insert sample grocery products with Kenyan prices (in KES)
INSERT INTO products (name, price, description, image_url, category, stock_quantity) VALUES
-- Fruits
('Fresh Bananas', 150, 'Sweet and ripe bananas, perfect for snacking or baking', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 'Fruits', 50),
('Red Apples', 200, 'Crisp and juicy red apples, great for eating fresh', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 'Fruits', 30),
('Oranges', 120, 'Fresh citrus oranges, packed with vitamin C', 'https://images.unsplash.com/photo-1557800634-7bf3c73bfab5?w=400', 'Fruits', 40),
('Strawberries', 300, 'Sweet and juicy strawberries, perfect for desserts', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 'Fruits', 25),
('Mangoes', 100, 'Sweet and juicy mangoes, perfect for smoothies', 'https://images.unsplash.com/photo-1553279768-2b83c2e31d60?w=400', 'Fruits', 35),
('Avocados', 80, 'Creamy avocados, great for salads and toast', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', 'Fruits', 40),

-- Vegetables
('Fresh Carrots', 80, 'Crunchy and nutritious carrots, great for cooking', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'Vegetables', 60),
('Broccoli', 120, 'Fresh green broccoli, perfect for healthy meals', 'https://images.unsplash.com/photo-1438118907701-94360ffc0e54?w=400', 'Vegetables', 35),
('Spinach', 60, 'Fresh leafy spinach, rich in iron and vitamins', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 'Vegetables', 45),
('Tomatoes', 100, 'Ripe red tomatoes, perfect for salads and cooking', 'https://images.unsplash.com/photo-1546470427-5c8d2e2e8c4b?w=400', 'Vegetables', 55),
('Onions', 70, 'Fresh onions, essential for cooking', 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400', 'Vegetables', 50),
('Cabbage', 50, 'Fresh green cabbage, great for salads', 'https://images.unsplash.com/photo-1594282486552-af4d4b5b5b5b?w=400', 'Vegetables', 40),

-- Dairy
('Fresh Milk', 120, 'Fresh whole milk, 1 liter', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 'Dairy', 20),
('Cheddar Cheese', 250, 'Sharp cheddar cheese, 200g block', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'Dairy', 15),
('Yogurt', 150, 'Creamy yogurt, 500ml container', 'https://images.unsplash.com/photo-1571212515410-2aef33a6b9b0?w=400', 'Dairy', 25),
('Butter', 180, 'Unsalted butter, 250g', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'Dairy', 30),

-- Meat & Seafood
('Chicken Breast', 400, 'Fresh boneless chicken breast, 1kg', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 'Meat & Seafood', 20),
('Beef Steak', 600, 'Fresh beef steak, 1kg', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', 'Meat & Seafood', 15),
('Fish Fillet', 500, 'Fresh fish fillet, 1kg', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 'Meat & Seafood', 25),
('Minced Meat', 350, 'Fresh minced meat, 1kg', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', 'Meat & Seafood', 20),

-- Pantry
('Rice', 200, 'Long grain rice, 2kg bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'Pantry', 40),
('Pasta', 150, 'Whole wheat pasta, 500g box', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400', 'Pantry', 50),
('Cooking Oil', 300, 'Vegetable cooking oil, 1 liter', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 'Pantry', 20),
('Bread', 80, 'Fresh whole grain bread loaf', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'Pantry', 30),
('Sugar', 120, 'White sugar, 1kg', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', 'Pantry', 25),
('Salt', 50, 'Table salt, 500g', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Pantry', 30),

-- Snacks
('Mixed Nuts', 400, 'Premium mixed nuts, 300g bag', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 'Snacks', 35),
('Biscuits', 150, 'Sweet biscuits, 200g pack', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', 'Snacks', 40),
('Tea Bags', 200, 'Black tea bags, 50 count', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Snacks', 30),
('Coffee', 350, 'Ground coffee, 250g', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'Snacks', 25);
