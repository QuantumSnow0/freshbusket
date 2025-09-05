-- Create user-assets bucket for profile pictures and other user files
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-assets', 'user-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for user-assets bucket
CREATE POLICY "Users can view their own assets" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own assets" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own assets" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assets" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

