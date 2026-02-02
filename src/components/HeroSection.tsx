import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient py-12 md:py-20">
      <div className="container-app">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              🇸🇳 La marketplace N°1 au Sénégal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Achetez tout ce dont vous avez besoin sur{' '}
              <span className="text-primary">Loufa Business</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Des milliers de produits de qualité, livrés partout au Sénégal. 
              Commandez facilement via WhatsApp !
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/categories">
                <Button size="lg" className="btn-primary-gradient rounded-full px-8">
                  Découvrir les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-warning/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-8xl">
                  🛒
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-xl shadow-lg font-semibold"
              >
                -50% 🔥
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -bottom-4 -left-4 bg-card px-4 py-2 rounded-xl shadow-lg font-semibold"
              >
                Livraison gratuite! 🚚
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-6 mt-16"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Livraison rapide</h3>
              <p className="text-sm text-muted-foreground">Partout au Sénégal</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Paiement sécurisé</h3>
              <p className="text-sm text-muted-foreground">À la livraison</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold">Support 24/7</h3>
              <p className="text-sm text-muted-foreground">Via WhatsApp</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
