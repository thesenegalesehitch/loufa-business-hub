export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  image_url: string | null;
  images: string[];
  stock: number;
  status: 'active' | 'top_vente' | 'promo' | 'rupture';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  latitude: number | null;
  longitude: number | null;
  items: CartItemOrder[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export interface CartItemOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}
