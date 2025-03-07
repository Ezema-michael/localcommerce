CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category TEXT,
  location TEXT,
  seller_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table sellers;
alter publication supabase_realtime add table product_badges;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table locations;

-- Insert initial categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Furniture'),
('Clothing'),
('Books'),
('Sports'),
('Home & Garden'),
('Toys'),
('Vehicles'),
('Services')
ON CONFLICT (name) DO NOTHING;

-- Insert initial locations
INSERT INTO locations (name) VALUES
('Downtown'),
('Uptown'),
('Westside'),
('Eastside'),
('Northside'),
('Southside')
ON CONFLICT (name) DO NOTHING;