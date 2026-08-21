-- ============================================================================
-- Create 'product-images' Storage Bucket and Policies in Supabase
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Create the 'product-images' bucket as a Public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- 2. Allow anyone to view / download images (Public Read)
DROP POLICY IF EXISTS "Public Access product-images" ON storage.objects;
CREATE POLICY "Public Access product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Allow uploads into product-images bucket (Insert)
DROP POLICY IF EXISTS "Allow Uploads product-images" ON storage.objects;
CREATE POLICY "Allow Uploads product-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- 4. Allow updating images in product-images bucket (Update)
DROP POLICY IF EXISTS "Allow Updates product-images" ON storage.objects;
CREATE POLICY "Allow Updates product-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- 5. Allow deleting images in product-images bucket (Delete)
DROP POLICY IF EXISTS "Allow Deletes product-images" ON storage.objects;
CREATE POLICY "Allow Deletes product-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
