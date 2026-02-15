-- =====================================================
-- Loufa Business Hub - Database Setup Script
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📦',
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'top_vente', 'promo', 'rupture')),
  is_featured BOOLEAN DEFAULT false,
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- Enable Row Level Security
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies - Profiles
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS Policies - Categories
-- =====================================================
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
CREATE POLICY "Authenticated users can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
CREATE POLICY "Authenticated users can update categories" 
ON public.categories FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;
CREATE POLICY "Authenticated users can delete categories" 
ON public.categories FOR DELETE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies - Products
-- =====================================================
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" 
ON public.products FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" 
ON public.products FOR DELETE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies - Orders
-- =====================================================
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" 
ON public.orders FOR UPDATE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies - Admin Users
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON public.admin_users;
CREATE POLICY "Authenticated users can view admin_users" 
ON public.admin_users FOR SELECT 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert admin_users" ON public.admin_users;
CREATE POLICY "Authenticated users can insert admin_users" 
ON public.admin_users FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update admin_users" ON public.admin_users;
CREATE POLICY "Authenticated users can update admin_users" 
ON public.admin_users FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete admin_users" ON public.admin_users;
CREATE POLICY "Authenticated users can delete admin_users" 
ON public.admin_users FOR DELETE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Full-text search function for products
CREATE OR REPLACE FUNCTION public.update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french', 
    COALESCE(NEW.name, '') || ' ' || 
    COALESCE(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to update search vector
DROP TRIGGER IF EXISTS products_search_vector_update ON public.products;
CREATE TRIGGER products_search_vector_update
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_search_vector();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories (slug);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON public.orders (created_at);

-- =====================================================
-- Insert Default Categories
-- =====================================================
INSERT INTO public.categories (name, slug, icon, description, display_order) VALUES
  ('Technologie', 'technologie', '💻', 'Ordinateurs, smartphones, gadgets', 1),
  ('Parfums', 'parfums', '🧴', 'Parfums et fragrances', 2),
  ('Mode', 'mode', '👗', 'Vêtements et accessoires', 3),
  ('Automobiles', 'automobiles', '🚗', 'Voitures et accessoires auto', 4),
  ('Soins Peau', 'soins-peau', '🧖', 'Produits de soins pour la peau', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Insert Sample Products (Optional)
-- =====================================================
INSERT INTO public.products (name, slug, description, price, original_price, category_id, image_url, stock, status, is_featured) 
SELECT 
  'iPhone 15 Pro',
  'iphone-15-pro',
  'Smartphone Apple iPhone 15 Pro - 256GB',
  650000,
  750000,
  id,
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
  10,
  'active',
  true
FROM public.categories WHERE slug = 'technologie'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, original_price, category_id, image_url, stock, status, is_featured) 
SELECT 
  'MacBook Pro M3',
  'macbook-pro-m3',
  'Ordinateur portable Apple MacBook Pro M3 - 16GB RAM',
  1200000,
  1400000,
  id,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
  5,
  'top_vente',
  true
FROM public.categories WHERE slug = 'technologie'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Grant Permissions (for development)
-- =====================================================
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.products TO anon, authenticated;
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.admin_users TO anon, authenticated;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- Done!
-- =====================================================
SELECT 'Database setup completed successfully!' as message;
