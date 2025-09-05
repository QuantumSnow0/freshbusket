-- Fix RLS policies for users table to allow user creation during registration
-- and order creation

-- Drop existing RLS policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new RLS policies that allow:
-- 1. Users to view their own profile
-- 2. Users to update their own profile  
-- 3. Users to insert their own profile (for registration)
-- 4. Allow system to create users (for order creation fallback)

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 4: Allow system to create users (for order creation fallback)
-- This policy allows the system to create user records when needed
CREATE POLICY "System can create users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Also ensure the users table has RLS enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';


