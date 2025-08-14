/*
  # Setup Gallery Image Storage

  1. Storage
    - Create 'gallery-images' storage bucket
    - Set up RLS policies for the bucket
    - Allow public read access and authenticated write access

  2. Database Updates
    - Add storage_path and file_size columns to gallery_images table (if not exists)
    - Update RLS policies for enhanced security

  3. Security
    - Public can view images
    - Only authenticated users can upload/delete images
    - File size and type restrictions
*/

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Storage policies for gallery-images bucket
-- Allow public to view images
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Ensure storage_path and file_size columns exist in gallery_images table
DO $$
BEGIN
  -- Add storage_path column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_images' AND column_name = 'storage_path'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN storage_path text;
  END IF;

  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_images' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN file_size integer;
  END IF;
END $$;

-- Update existing RLS policies to be more specific
DROP POLICY IF EXISTS "Allow authenticated users to manage gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Public read access" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated delete access" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated insert access" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated update access" ON gallery_images;

-- Create comprehensive RLS policies for gallery_images table
CREATE POLICY "Public can read published gallery images"
ON gallery_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
ON gallery_images FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery images"
ON gallery_images FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery images"
ON gallery_images FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');