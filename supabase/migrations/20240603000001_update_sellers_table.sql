-- Add additional fields to sellers table
ALTER TABLE sellers
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create index on seller name for faster searches
CREATE INDEX IF NOT EXISTS idx_sellers_name ON sellers(name);

-- Create index on seller rating for faster sorting
CREATE INDEX IF NOT EXISTS idx_sellers_rating ON sellers(rating);
