-- =====================================================
-- Storage Setup Script
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create a bucket for storing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies

-- Allow public read access to images
DROP POLICY IF EXISTS "Public images are accessible by everyone" ON storage.objects;
CREATE POLICY "Public images are accessible by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update images
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete images
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

SELECT 'Storage bucket created successfully!' as message;
