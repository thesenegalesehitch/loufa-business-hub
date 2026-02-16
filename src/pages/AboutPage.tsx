import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Car, 
  Shirt, 
  GraduationCap, 
  Bitcoin, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle2,
  Star,
  Users,
  Package
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialLinksVertical } from '@/components/SocialLinks';
import { StaticLocationMap } from '@/components/LocationPicker';
import { VideoBackground } from '@/components/VideoBackground';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <ShoppingBag className="h-8 w-8" />,
    title: 'E-Commerce',
    description: 'Vente de produits variés : électronique, mode, maison, et bien plus encore.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: 'Automobiles',
    description: 'Import et vente de véhicules neufs et d\'occasion de qualité.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Shirt className="h-8 w-8" />,
    title: 'Maillots de Foot',
    description: 'Maillots officiels et répliques des plus grands clubs du monde.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'Formations',
    description: 'Formations en business, marketing digital, et développement personnel.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: <Bitcoin className="h-8 w-8" />,
    title: 'Crypto-monnaies',
    description: 'Conseil et accompagnement dans l\'univers des cryptos.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Investissements',
    description: 'Opportunités d\'investissement et conseils financiers.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const stats = [
  { icon: <Users className="h-6 w-6" />, value: '5000+', label: 'Clients satisfaits' },
  { icon: <Package className="h-6 w-6" />, value: '10000+', label: 'Produits vendus' },
  { icon: <Star className="h-6 w-6" />, value: '4.9/5', label: 'Note moyenne' },
  { icon: <CheckCircle2 className="h-6 w-6" />, value: '99%', label: 'Livraisons réussies' },
];

// Keur Massar, Dakar, Senegal coordinates
const BUSINESS_LOCATION: [number, number] = [14.7645, -17.3142];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <VideoBackground
          videoUrl="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4"
          fallbackImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920"
          className="min-h-[60vh] flex items-center"
        >
          <div className="container-app py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm mb-6">
                🚀 Le futur Alibaba du Sénégal
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bienvenue chez{' '}
                <span className="text-primary">Loufa Pro</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Je suis un entrepreneur polyvalent basé à Keur Massar, Dakar. 
                Des voitures aux maillots de foot, des formations à la crypto — 
                il n'y a pas de domaine que je ne couvre pas. Je suis un véritable Alibaba !
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/">
                  <Button size="lg" className="btn-primary-gradient rounded-xl">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Voir la boutique
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => window.open('https://wa.me/c/221767558976', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Me contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </VideoBackground>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container-app">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-card rounded-2xl shadow-card"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="container-app py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mes Domaines d'Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un écosystème complet de services pour répondre à tous vos besoins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-6 bg-card rounded-2xl shadow-card border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact & Location Section */}
        <section className="bg-muted/30 py-16">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📍 Où me trouver
              </h2>
              <p className="text-muted-foreground">
                Basé à Keur Massar, Dakar, Sénégal
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <StaticLocationMap
                  center={BUSINESS_LOCATION}
                  zoom={15}
                  markerPosition={BUSINESS_LOCATION}
                  className="h-80 lg:h-full min-h-[320px]"
                />
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Adresse
                  </h3>
                  <p className="text-muted-foreground">
                    Keur Massar, Dakar<br />
                    Sénégal 🇸🇳
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Horaires
                  </h3>
                  <p className="text-muted-foreground">
                    Lundi - Samedi : 8h00 - 20h00<br />
                    Dimanche : 10h00 - 18h00
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="text-xl font-bold mb-4">Réseaux Sociaux</h3>
                  <SocialLinksVertical />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-app py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à faire affaire ?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Que vous cherchiez un produit spécifique, une formation, ou des conseils en investissement,
              je suis là pour vous accompagner.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/">
                <Button size="lg" variant="secondary" className="rounded-xl">
                  Explorer la boutique
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.open('https://wa.me/c/221767558976', '_blank')}
              >
                Contacter sur WhatsApp
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
