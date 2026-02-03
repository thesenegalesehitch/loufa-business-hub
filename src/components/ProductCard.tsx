import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/database';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN').format(price);
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.status === 'rupture') {
      toast.error('Ce produit est en rupture de stock');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    
    toast.success(`1 x ${product.name} ajouté au panier`, {
      action: {
        label: 'Voir le panier',
        onClick: () => navigate('/panier'),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="product-card group"
    >
      <Link to={`/produit/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <motion.img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📦
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.status === 'promo' && discount > 0 && (
              <span className="badge-promo">-{discount}%</span>
            )}
            {product.status === 'top_vente' && (
              <span className="badge-top">🔥 TOP VENTE</span>
            )}
            {product.status === 'rupture' && (
              <span className="badge-rupture">RUPTURE</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg"
                onClick={handleAddToCart}
                disabled={product.status === 'rupture'}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)} <span className="text-xs font-normal">FCFA</span>
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
