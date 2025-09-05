-- Fix RLS policies to allow admin access to products table
-- This allows the admin user to manage products

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Create admin policy for products table
-- This allows the admin email to perform all operations on products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL
  USING (auth.email() = 'bmuthuri93@gmail.com')
  WITH CHECK (auth.email() = 'bmuthuri93@gmail.com');

-- Also ensure the products table has RLS enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Check current RLS policies for products table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- Check current RLS policies for users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';

