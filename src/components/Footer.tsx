import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="container-app">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl">Loufa Business</span>
            </div>
            <p className="text-sm text-background/70 mb-4">
              La marketplace N°1 au Sénégal. Des milliers de produits de qualité livrés chez vous.
            </p>
            <SocialLinks size="sm" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/categories" className="hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-primary transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/panier" className="hover:text-primary transition-colors">
                  Mon panier
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>E-Commerce</li>
              <li>Automobiles</li>
              <li>Formations</li>
              <li>Crypto & Investissements</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +221 77 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@loufabusiness.sn
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Keur Massar, Dakar, Sénégal
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/50">
          <p>© {currentYear} Loufa Business. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
