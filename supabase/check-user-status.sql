-- Check User Status
-- Run this in your Supabase SQL Editor to see the current state of users

-- Check auth.users (all registered users)
SELECT 
  'auth.users' as table_name,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Check public.users (only verified users)
SELECT 
  'public.users' as table_name,
  id,
  name,
  email,
  created_at
FROM users
ORDER BY created_at DESC;

-- Check for unverified users in public.users
SELECT 
  'Unverified users in public.users' as status,
  COUNT(*) as count
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.email_confirmed_at IS NULL;



