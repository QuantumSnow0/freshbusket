-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Set up RLS policies for the storage bucket
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Only admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.jwt() ->> 'email' = 'bmuthuri93@gmail.com'
  );

CREATE POLICY "Only admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.jwt() ->> 'email' = 'bmuthuri93@gmail.com'
  );

CREATE POLICY "Only admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.jwt() ->> 'email' = 'bmuthuri93@gmail.com'
  );



