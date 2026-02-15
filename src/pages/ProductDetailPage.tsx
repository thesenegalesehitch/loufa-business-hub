import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  const fetchProduct = async (productSlug: string) => {
    setIsLoading(true);
    try {
      // Fetch product by slug
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', productSlug)
        .single();

      if (productError) throw productError;
      
      setProduct(productData);
      
      // Fetch category if exists
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', productData.category_id)
          .single();
        setCategory(categoryData);
        
        // Fetch related products from same category
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .eq('status', 'active')
          .limit(4);
        setRelatedProducts(relatedData || []);
      }
      
      // Get all images for gallery
      if (productData.images && productData.images.length > 0) {
        // Images are already available
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });
    
    toast.success(`${quantity}x ${product.name} ajouté au panier`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN').format(price);
  };

  const getAllImages = () => {
    if (!product) return [];
    const images = [product.image_url].filter(Boolean);
    if (product.images) {
      images.push(...product.images.filter(Boolean));
    }
    return images;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-app py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Produit non trouvé</p>
      </div>
    );
  }

  const images = getAllImages();
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-app py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-primary">Catégories</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/categorie/${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-xl overflow-hidden bg-muted"
            >
              {images[selectedImage] ? (
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  📦
                </div>
              )}
            </motion.div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {category && (
                <Badge variant="secondary" className="mb-2">
                  {category.icon} {category.name}
                </Badge>
              )}
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {product.status === 'promo' && discount > 0 && (
                  <Badge className="bg-destructive">-{discount}%</Badge>
                )}
                {product.status === 'top_vente' && (
                  <Badge className="bg-primary">🔥 Top Vente</Badge>
                )}
                {product.status === 'rupture' && (
                  <Badge variant="destructive">⛔ Rupture de stock</Badge>
                )}
                {product.is_featured && (
                  <Badge variant="outline">⭐ À la une</Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)} FCFA
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price)} FCFA
                  </span>
                )}
              </div>
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="text-success flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="text-destructive">Rupture de stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.status !== 'rupture' && (
              <div className="space-y-2">
                <Label>Quantité</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1 btn-primary-gradient"
                onClick={handleAddToCart}
                disabled={product.status === 'rupture'}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Livraison</p>
                  <p className="text-muted-foreground">Partout au Sénégal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Garantie</p>
                  <p className="text-muted-foreground">Produit authentique</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Retour</p>
                  <p className="text-muted-foreground">Sous 7 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <Link 
                  key={prod.id}
                  to={`/produit/${prod.slug}`}
                  className="product-card group"
                >
                  <div className="aspect-square bg-muted rounded-t-xl overflow-hidden">
                    {prod.image_url ? (
                      <img 
                        src={prod.image_url} 
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{prod.name}</h3>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(prod.price)} Fcfa
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

import { Label } from '@/components/ui/label';

export default ProductDetailPage;
