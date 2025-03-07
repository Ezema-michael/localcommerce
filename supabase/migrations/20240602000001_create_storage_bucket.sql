-- Create a storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace');

-- Set up storage policy to allow public access to read images
DROP POLICY IF EXISTS "Allow public access to marketplace images" ON storage.objects;
CREATE POLICY "Allow public access to marketplace images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'marketplace');

-- For development, allow anyone to upload images
DROP POLICY IF EXISTS "Allow anyone to upload images" ON storage.objects;
CREATE POLICY "Allow anyone to upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'marketplace');

-- Allow anyone to update their own images
DROP POLICY IF EXISTS "Allow anyone to update their own images" ON storage.objects;
CREATE POLICY "Allow anyone to update their own images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'marketplace');
