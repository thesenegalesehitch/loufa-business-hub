-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table with full-text search
CREATE TABLE public.products (
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

-- Orders table for tracking
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Orders can be inserted by anyone (guest checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Orders policies for authenticated users (dev mode - change in production)
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own orders" 
ON public.orders FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Admin users policies - Simplified for dev (allow any authenticated user)
CREATE POLICY "Authenticated users can view admin_users" 
ON public.admin_users FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert admin_users" 
ON public.admin_users FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update admin_users" 
ON public.admin_users FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete admin_users" 
ON public.admin_users FOR DELETE 
USING (auth.role() = 'authenticated');

-- Product management policies for authenticated users (dev mode)
CREATE POLICY "Authenticated users can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
ON public.products FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
ON public.products FOR DELETE 
USING (auth.role() = 'authenticated');

-- Category management policies for authenticated users (dev mode)
CREATE POLICY "Authenticated users can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" 
ON public.categories FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" 
ON public.categories FOR DELETE 
USING (auth.role() = 'authenticated');

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

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for full-text search
CREATE INDEX products_search_idx ON public.products USING GIN (search_vector);
CREATE INDEX products_category_idx ON public.products (category_id);
CREATE INDEX products_status_idx ON public.products (status);
CREATE INDEX products_featured_idx ON public.products (is_featured) WHERE is_featured = true;
CREATE INDEX categories_slug_idx ON public.categories (slug);
CREATE INDEX products_slug_idx ON public.products (slug);

-- Insert categories
INSERT INTO public.categories (name, slug, icon, description, display_order) VALUES
  ('Technologie', 'technologie', '💻', 'Ordinateurs, smartphones, gadgets', 1),
  ('Parfums', 'parfums', '🧴', 'Parfums et fragrances', 2),
  ('Mode', 'mode', '👗', 'Vêtements et accessoires', 3),
  ('Automobiles', 'automobiles', '🚗', 'Voitures et accessoires auto', 4),
  ('Soins Peau', 'soins-peau', '🧖', 'Produits de soins pour la peau', 5);
