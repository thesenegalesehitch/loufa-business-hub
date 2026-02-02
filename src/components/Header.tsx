import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { SearchBar } from './SearchBar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              Loufa <span className="text-primary">Business</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/panier')}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Button>

            {/* Admin Link */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => navigate('/admin')}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <SearchBar onSearch={() => setIsSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg"
          >
            <nav className="container-app py-4 space-y-2">
              <Link
                to="/categories"
                className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link
                to="/panier"
                className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Mon Panier ({totalItems})
              </Link>
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Administration
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
