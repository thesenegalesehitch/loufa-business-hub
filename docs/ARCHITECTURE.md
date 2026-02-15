# 🏗️ Architecture Technique - Loufa Business Hub

## État Actuel vs État Cible

### Stack Actuelle
```
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + Storage)
State: Zustand (cartStore)
Routing: React Router v6
```

### Stack Cible
```
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
State: Zustand + React Query
Cache: Service Worker (Vite PWA)
Images: Cloudinary (optimisation)
```

---

## 🔐Sécurité

### Problèmes Identifiés
- ❌ Login admin codé en dur dans le code
- ❌ Clés API exposées dans le frontend
- ❌ Pas de validation côté serveur

### Solutions

#### 1. Authentification Admin via Supabase
```sql
-- Table admin_users avec RLS stricte
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP DEFAULT now()
);

-- Politique RLS: seul le super_admin peut gérer les admins
CREATE POLICY "Super admins can manage admins"
ON admin_users FOR ALL
USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin')
);
```

#### 2. Row Level Security (RLS)
- Toutes les tables avec RLS activé
- Politiques granulaires par rôle
- Validation côté serveur avec Edge Functions

---

## 📦 Gestion des Produits

### Problèmes Identifiés
- ❌ Pas de gestion des variantes (taille, couleur)
- ❌ Upload d'images via URL uniquement
- ❌ Pas de gestion de stock automatique

### Solutions

#### 1. Table des Variantes
```sql
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  name TEXT, -- ex: "Rouge / XL"
  sku TEXT UNIQUE,
  price_modifier INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  image_url TEXT
);

CREATE TABLE public.product_options (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  name TEXT, -- ex: "Couleur", "Taille"
  values TEXT[] -- ex: ["Rouge", "Bleu", "Vert"]
);
```

#### 2. Upload d'images via Supabase Storage
```typescript
// Bucket: 'product-images'
// Dossiers: /products/{productId}/

const uploadImage = async (file: File, productId: string) => {
  const fileName = `${productId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
    
  // Obtenir l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
};
```

#### 3. Gestion du Stock
```typescript
// Décrementer le stock lors d'une commande
const updateStock = async (orderItems: OrderItem[]) => {
  for (const item of orderItems) {
    await supabase.rpc('decrement_stock', {
      variant_id: item.variant_id,
      quantity: item.quantity
    });
  }
};
```

---

## 🖼️ Images & Performance

### Problèmes Identifiés
- ❌ Images trop lourdes
- ❌ Pas de lazy loading
- ❌ Pas de format WebP
- ❌ Pas de cache

### Solutions

#### 1. Optimisation avec Cloudinary/Supabase
```typescript
// Utiliser les transformations d'URL Supabase
const getOptimizedImage = (url: string, width: number) => {
  // Supabase Storage transformations
  return `${url}?width=${width}&quality=80&format=webp`;
};

// React component avec lazy loading
<Image 
  src={getOptimizedImage(product.image_url, 400)}
  alt={product.name}
  loading="lazy"
  width={400}
  height={400}
/>
```

#### 2. Service Worker pour Cache (Vite PWA)
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Loufa Business',
        short_name: 'Loufa',
        theme_color: '#f97316',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192' },
          { src: 'pwa-512x512.png', sizes: '512x512' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|webp)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 📝 SEO

### Optimisations Needed
- ❌ Meta tags dynamiques manquants
- ❌ Pas de sitemap.xml
- ❌ Pas de robots.txt complet
- ❌ Pas de structure données JSON-LD

### Solutions

```typescript
// src/lib/seo.ts
export const generateMetadata = (product: Product): Metadata => ({
  title: `${product.name} | Loufa Business`,
  description: product.description?.slice(0, 160),
  openGraph: {
    title: product.name,
    description: product.description,
    images: [product.image_url],
  },
  other: {
    'product:price:amount': product.price.toString(),
    'product:price:currency': 'XOF',
  }
});

// JSON-LD pour produits
const generateProductSchema = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image_url,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'XOF',
    availability: product.stock > 0 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock'
  }
});
```

---

## 🗃️ Base de Données - Schéma Final

```sql
-- Tables principales
profiles          -- Extension des utilisateurs auth
categories        -- Catégories de produits
products          -- Produits principaux
product_variants  -- Variantes (taille, couleur)
product_options   -- Options configurables
product_images    -- Galerie d'images
orders            -- Commandes
order_items       -- Articles commandés
admin_users       -- Gestion admins
faq               -- Foire aux questions
```

---

## 📁 Structure des Fichiers

```
src/
├── components/
│   ├── common/          # Composants réutilisables
│   ├── layout/          # Header, Footer, Layout
│   ├── product/         # ProductCard, ProductGrid, ProductDetail
│   ├── cart/            # CartItem, CartSummary
│   └── ui/              # Composants shadcn/ui
├── contexts/
│   ├── AuthContext.tsx  # Auth utilisateur
│   └── CartContext.tsx  # Gestion panier
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts   # React Query hooks
│   └── useOrders.ts
├── lib/
│   ├── supabase/        # Client et types
│   ├── seo.ts          # Meta tags
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   ├── ProductPage.tsx  # Page détail produit
│   ├── CartPage.tsx
│   ├── LoginPage.tsx
│   ├── AdminPage.tsx
│   └── FAQPage.tsx
├── stores/
│   └── cartStore.ts
└── types/
    └── database.ts
```

---

## 🚀 Plan d'Action Priorisé

### Phase 1: Sécurité (Semaine 1)
1. Supprimer le login admin codé en dur
2. Configurer RLS pour toutes les tables
3. Créer les Edge Functions pour validation

### Phase 2: Core Features (Semaine 2-3)
1. Page produit détaillée avec variantes
2. Upload d'images vers Supabase Storage
3. Gestion automatique du stock

### Phase 3: UX (Semaine 4)
1. Lazy loading des images
2. Cache Service Worker
3. Animations fluides

### Phase 4: Performance (Semaine 5)
1. Optimisation WebP
2. Code splitting
3. SEO (sitemap, robots.txt, JSON-LD)

### Phase 5: Support (Semaine 6)
1. Page FAQ
2. Chat WhatsApp intégré
3. Politique de retour
