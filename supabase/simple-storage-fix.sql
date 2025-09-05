-- Simple fix for storage bucket policies
-- Run this in Supabase Dashboard → Database → SQL Editor

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

-- Create simple policies that allow authenticated users to manage user-assets
CREATE POLICY "Allow authenticated users to view user-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload to user-assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update user-assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete user-assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-assets' AND auth.role() = 'authenticated');

-- Success message
SELECT 'Storage policies simplified and fixed!' as status;

