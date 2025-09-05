-- Create Test Data Script
-- Run this AFTER you have registered a user in your app
-- This will create test orders for the existing user

-- First, get the first user's ID (replace with your actual user ID if needed)
-- You can find your user ID in the Supabase Auth section or by running:
-- SELECT id, email FROM auth.users LIMIT 1;

-- Create a test order (replace the user_id with your actual user ID)
-- To get your user ID, run this first:
-- SELECT id, email FROM auth.users;

-- Then replace 'YOUR_USER_ID_HERE' with the actual ID
INSERT INTO orders (items, total_price, payment_status, delivery_address, stripe_payment_intent_id) VALUES
('[{"product_id": "00000000-0000-0000-0000-000000000001", "product_name": "Fresh Bananas", "quantity": 2, "price": 2.99}]', 
 5.98, 'paid', '123 Test Street, Test City, TC 12345', 'pi_test_123456789');

-- Create another test order
INSERT INTO orders (items, total_price, payment_status, delivery_address, stripe_payment_intent_id) VALUES
('[{"product_id": "00000000-0000-0000-0000-000000000002", "product_name": "Red Apples", "quantity": 3, "price": 3.49}]', 
 10.47, 'pending', '456 Another Street, Test City, TC 12345', 'pi_test_987654321');

-- Verify the test data
SELECT 'Test data created!' as status;
SELECT COUNT(*) as order_count FROM orders;
SELECT * FROM orders ORDER BY created_at DESC;



