-- Create missing users in public.users table
-- Run this AFTER setting up the trigger

-- Insert the confirmed users that are missing from public.users
INSERT INTO public.users (id, name, email, address, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'User') as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'address', '') as address,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
WHERE au.email_confirmed_at IS NOT NULL
  AND au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO UPDATE SET
  name = COALESCE(EXCLUDED.name, users.name),
  email = EXCLUDED.email,
  address = COALESCE(EXCLUDED.address, users.address),
  updated_at = NOW();

-- Show the result
SELECT 'Missing users created successfully!' as status;
SELECT COUNT(*) as total_users FROM public.users;


