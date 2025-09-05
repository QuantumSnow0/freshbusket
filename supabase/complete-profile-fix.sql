-- COMPLETE PROFILE SYSTEM FIX
-- Run this entire script in Supabase Dashboard → Database → SQL Editor

-- =============================================
-- 1. UPDATE USERS TABLE
-- =============================================
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- =============================================
-- 2. CREATE USER_ADDRESSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
  full_name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Kenya',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_type ON public.user_addresses(type);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CREATE RLS POLICIES FOR USER_ADDRESSES
-- =============================================
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;

-- Create new policies
CREATE POLICY "Users can view their own addresses" ON public.user_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON public.user_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.user_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.user_addresses
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 4. CREATE TRIGGER FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_user_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON public.user_addresses;
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_user_addresses_updated_at();

-- =============================================
-- 5. CREATE USER-ASSETS STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-assets', 'user-assets', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 6. FIX STORAGE BUCKET POLICIES
-- =============================================
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage their assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view user-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to user-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update user-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete user-assets" ON storage.objects;

-- Create simple, working policies
CREATE POLICY "Allow authenticated users to view user-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload to user-assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update user-assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete user-assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

-- =============================================
-- 7. VERIFY SETUP
-- =============================================
-- Check tables
SELECT 
  'Tables created:' as status,
  schemaname,
  tablename
FROM pg_tables 
WHERE tablename IN ('users', 'user_addresses')
AND schemaname = 'public';

-- Check storage bucket
SELECT 
  'Storage bucket:' as status,
  id, 
  name, 
  public 
FROM storage.buckets 
WHERE id = 'user-assets';

-- Check policies
SELECT 
  'Policies created:' as status,
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename IN ('users', 'user_addresses')
AND schemaname = 'public';

-- Final success message
SELECT '🎉 PROFILE SYSTEM COMPLETELY FIXED! 🎉' as status;
