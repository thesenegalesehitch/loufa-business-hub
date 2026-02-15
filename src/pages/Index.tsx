import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductGrid } from '@/components/ProductGrid';
import { supabase } from '@/integrations/supabase/client';
import type { Category, Product } from '@/types/database';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');
        
        // Fetch featured products
        const { data: featuredData } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .neq('status', 'rupture')
          .limit(8);
        
        // Fetch top selling products
        const { data: topData } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'top_vente')
          .limit(4);
        
        // Fetch promo products
        const { data: promoData } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'promo')
          .limit(4);
        
        setCategories((categoriesData as unknown as Category[]) || []);
        setFeaturedProducts((featuredData as unknown as Product[]) || []);
        setTopProducts((topData as unknown as Product[]) || []);
        setPromoProducts((promoData as unknown as Product[]) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        {/* Categories Section */}
        <section className="container-app py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Parcourir par catégorie
            </h2>
            <p className="text-muted-foreground">
              Trouvez rapidement ce que vous cherchez
            </p>
          </motion.div>
          
          <CategoryGrid categories={categories} />
        </section>

        {/* Featured Products */}
        <section className="container-app py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Produits à la une ⭐
              </h2>
              <p className="text-muted-foreground">
                Découvrez notre sélection du moment
              </p>
            </div>
          </motion.div>
          
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </section>

        {/* Top Selling Products */}
        {topProducts.length > 0 && (
          <section className="container-app py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                🔥 Meilleures ventes
              </h2>
              <p className="text-muted-foreground">
                Les produits les plus populaires
              </p>
            </motion.div>
            
            <ProductGrid products={topProducts} isLoading={isLoading} />
          </section>
        )}

        {/* Promo Products */}
        {promoProducts.length > 0 && (
          <section className="container-app py-12 bg-gradient-to-b from-destructive/5 to-transparent">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-destructive">
                🏷️ Promotions
              </h2>
              <p className="text-muted-foreground">
                Profitez de nos offres exceptionnelles
              </p>
            </motion.div>
            
            <ProductGrid products={promoProducts} isLoading={isLoading} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
