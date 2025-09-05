-- Cleanup Unverified Users
-- Run this in your Supabase SQL Editor to remove users who haven't confirmed their email

-- First, let's see what unverified users exist
SELECT 
  u.id,
  u.name,
  u.email,
  u.created_at,
  au.email_confirmed_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.email_confirmed_at IS NULL;

-- Delete unverified users from the public.users table
-- (This will only affect users who haven't confirmed their email)
DELETE FROM users 
WHERE id IN (
  SELECT u.id 
  FROM users u
  LEFT JOIN auth.users au ON u.id = au.id
  WHERE au.email_confirmed_at IS NULL
);

-- Show remaining users (should only be verified ones)
SELECT 
  u.id,
  u.name,
  u.email,
  u.created_at,
  au.email_confirmed_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;



