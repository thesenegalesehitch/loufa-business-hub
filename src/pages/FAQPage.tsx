import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Shield, 
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Livraison',
    icon: Truck,
    questions: [
      {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Nos délais de livraison sont de 24 à 72 heures pour Dakar et 3 à 7 jours pour les autres régions du Sénégal. Nous proposons également la livraison express pour certaines zones.'
      },
      {
        question: 'Combien coûte la livraison ?',
        answer: 'La livraison est gratuite pour toute commande supérieure à 50 000 Fcfa. Pour les commandes inférieures, les frais de livraison sont de 2 500 Fcfa à Dakar et 5 000 Fcfa en province.'
      },
      {
        question: 'Puis-je suivre ma commande ?',
        answer: 'Oui, vous recevrez un numéro de suivi par SMS et email dès l\'expédition de votre commande. Vous pouvez également suivre votre colis sur notre page de suivi.'
      }
    ]
  },
  {
    title: 'Retours & Échanges',
    icon: RotateCcw,
    questions: [
      {
        question: 'Quelle est la politique de retour ?',
        answer: 'Vous avez 7 jours après réception pour retourner un produit. Le produit doit être dans son état d\'origine avec l\'emballage. Les frais de retour sont à votre charge sauf en cas de produit défectueux.'
      },
      {
        question: 'Comment effectuer un retour ?',
        answer: 'Contactez-nous via WhatsApp au +221 76 755 89 76 ou par email à contact@loufabusiness.sn. Nous vous fournirons les instructions de retour.'
      },
      {
        question: 'Quand serai-je remboursé ?',
        answer: 'Le remboursement est effectué sous 5 à 10 jours ouvrables après réception et vérification du produit retourné. Le montant sera crédité sur le même moyen de paiement utilisé.'
      }
    ]
  },
  {
    title: 'Paiement',
    icon: CreditCard,
    questions: [
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer: 'Nous acceptons le paiement par Wave, Orange Money, Free Money, et espèces lors de la livraison (Cash on Delivery).'
      },
      {
        question: 'Le paiement en ligne est-il sécurisé ?',
        answer: 'Oui, tous nos paiements sont sécurisés. Nous utilisons des plateformes de paiement agréées et vos données bancaires ne sont jamais stockées sur nos serveurs.'
      }
    ]
  },
  {
    title: 'Garantie & Qualité',
    icon: Shield,
    questions: [
      {
        question: 'Quels produits ont une garantie ?',
        answer: 'Tous nos produits électroniques ont une garantie minimale de 6 mois. Les produits electromenagers ont une garantie de 1 an. La garantie ne couvre pas les dommages causés par une mauvaise utilisation.'
      },
      {
        question: 'Comment activer la garantie ?',
        answer: 'Conservez votre facture comme preuve d\'achat. En cas de problème, contactez-nous avec les photos du défaut et votre numéro de commande.'
      },
      {
        question: 'Les produits sont-ils authentiques ?',
        answer: 'Oui, nous sommes un revendeur officiel de toutes les marques proposées. Tous nos produits viennent directement des distributeurs agréés.'
      }
    ]
  }
];

const FAQPage = () => {
  const WHATSAPP_NUMBER = '221767558976';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-app py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos produits, livraisons et services.
          </p>
        </motion.div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm opacity-90">Discuter avec nous</p>
            </div>
          </a>
          
          <a 
            href="mailto:contact@loufabusiness.sn"
            className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Mail className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">Email</p>
              <p className="text-sm opacity-90">contact@loufabusiness.sn</p>
            </div>
          </a>
          
          <div className="flex items-center justify-center gap-3 p-4 bg-card border rounded-xl">
            <Phone className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Appel</p>
              <p className="text-sm text-muted-foreground">+221 76 755 89 76</p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{category.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="bg-card rounded-xl border">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem key={questionIndex} value={`${categoryIndex}-${questionIndex}`}>
                    <AccordionTrigger className="px-6 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-muted-foreground mb-4">
            Notre équipe est disponible pour vous aider
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild className="btn-primary-gradient">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Nous contacter sur WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/a-propos">À propos de nous</Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
