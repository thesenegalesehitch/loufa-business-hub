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

-- Only admins can view orders
CREATE POLICY "Admins can view orders" 
ON public.orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Only admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Admin users policies
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Product management policies for admins
CREATE POLICY "Admins can insert products" 
ON public.products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Category management policies for admins
CREATE POLICY "Admins can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update categories" 
ON public.categories FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete categories" 
ON public.categories FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

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

-- Insert sample categories
INSERT INTO public.categories (name, slug, icon, description, display_order) VALUES
  ('Électronique', 'electronique', '📱', 'Smartphones, ordinateurs, accessoires', 1),
  ('Mode', 'mode', '👗', 'Vêtements, chaussures, accessoires', 2),
  ('Maison', 'maison', '🏠', 'Meubles, décoration, électroménager', 3),
  ('Beauté', 'beaute', '💄', 'Cosmétiques, parfums, soins', 4),
  ('Sport', 'sport', '⚽', 'Équipements sportifs, vêtements', 5),
  ('Alimentation', 'alimentation', '🍎', 'Produits frais, épicerie', 6);

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, original_price, category_id, status, is_featured, stock) VALUES
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Le dernier iPhone avec puce A17 Pro', 950000, 1100000, (SELECT id FROM public.categories WHERE slug = 'electronique'), 'top_vente', true, 15),
  ('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Smartphone Android haut de gamme', 650000, NULL, (SELECT id FROM public.categories WHERE slug = 'electronique'), 'active', true, 20),
  ('MacBook Air M3', 'macbook-air-m3', 'Ordinateur portable Apple léger et puissant', 1200000, 1350000, (SELECT id FROM public.categories WHERE slug = 'electronique'), 'promo', true, 8),
  ('Robe Africaine Wax', 'robe-africaine-wax', 'Magnifique robe en tissu wax authentique', 35000, NULL, (SELECT id FROM public.categories WHERE slug = 'mode'), 'top_vente', true, 50),
  ('Ensemble Boubou Homme', 'ensemble-boubou-homme', 'Boubou traditionnel brodé à la main', 45000, 55000, (SELECT id FROM public.categories WHERE slug = 'mode'), 'promo', false, 30),
  ('Canapé 3 Places', 'canape-3-places', 'Canapé moderne confortable', 250000, NULL, (SELECT id FROM public.categories WHERE slug = 'maison'), 'active', true, 5),
  ('Parfum Oriental', 'parfum-oriental', 'Fragrance luxueuse aux notes orientales', 25000, 30000, (SELECT id FROM public.categories WHERE slug = 'beaute'), 'promo', false, 100),
  ('Maillot Sénégal', 'maillot-senegal', 'Maillot officiel équipe nationale', 20000, NULL, (SELECT id FROM public.categories WHERE slug = 'sport'), 'top_vente', true, 200),
  ('Écouteurs AirPods Pro', 'airpods-pro', 'Écouteurs sans fil avec réduction de bruit', 180000, 220000, (SELECT id FROM public.categories WHERE slug = 'electronique'), 'promo', false, 45),
  ('Sac à Main Cuir', 'sac-main-cuir', 'Sac élégant en cuir véritable', 55000, NULL, (SELECT id FROM public.categories WHERE slug = 'mode'), 'active', false, 25);