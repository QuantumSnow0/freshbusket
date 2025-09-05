-- Fix storage bucket policies for profile pictures
-- Run this in Supabase Dashboard → Database → SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own assets" ON storage.objects;

-- Create new policies that work with profile-pictures folder structure
CREATE POLICY "Users can view profile pictures" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-assets' 
    AND (storage.foldername(name))[1] = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can upload profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-assets' 
    AND (storage.foldername(name))[1] = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can update profile pictures" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-assets' 
    AND (storage.foldername(name))[1] = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can delete profile pictures" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-assets' 
    AND (storage.foldername(name))[1] = 'profile-pictures'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- Also create a more permissive policy for authenticated users
CREATE POLICY "Authenticated users can manage their assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user-assets' 
    AND auth.role() = 'authenticated'
  );

-- Success message
SELECT 'Storage policies fixed successfully!' as status;

