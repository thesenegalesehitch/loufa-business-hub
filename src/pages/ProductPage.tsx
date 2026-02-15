import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Minus, Plus, Share2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/database';
import { toast } from 'sonner';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data as unknown as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Produit non trouvé');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN').format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.status === 'rupture') {
      toast.error('Ce produit est en rupture de stock');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      });
    }

    toast.success(`${quantity} x ${product.name} ajouté au panier`, {
      action: {
        label: 'Voir le panier',
        onClick: () => navigate('/panier'),
      },
    });
  };

  const handleShare = async () => {
    if (!product) return;
    
    try {
      await navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur Loufa Pro!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container-app py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container-app py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                📦
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.status === 'promo' && discount > 0 && (
                <span className="badge-promo text-sm">-{discount}%</span>
              )}
              {product.status === 'top_vente' && (
                <span className="badge-top text-sm">🔥 TOP VENTE</span>
              )}
              {product.status === 'rupture' && (
                <span className="badge-rupture text-sm">RUPTURE</span>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)} FCFA
                </span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price)} FCFA
                  </span>
                )}
              </div>

              {product.stock > 0 && product.status !== 'rupture' && (
                <p className="text-sm text-success font-medium">
                  ✓ En stock ({product.stock} disponibles)
                </p>
              )}
            </div>

            {product.description && (
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.status !== 'rupture' && (
              <div>
                <h2 className="font-semibold mb-3">Quantité</h2>
                <div className="flex items-center gap-4">
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
                  <span className="text-muted-foreground text-sm">
                    Total: {formatPrice(product.price * quantity)} FCFA
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 btn-primary-gradient rounded-xl"
                onClick={handleAddToCart}
                disabled={product.status === 'rupture'}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.status === 'rupture' ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* WhatsApp CTA */}
            <div className="p-4 bg-success/10 rounded-xl">
              <p className="text-sm text-center">
                💬 Une question? Contactez-nous sur WhatsApp!
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
