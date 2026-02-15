import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-app py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* CGV */}
          <section>
            <h1 className="text-3xl font-bold mb-6">Conditions Générales de Vente (CGV)</h1>
            
            <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
              <h2 className="text-xl font-semibold text-foreground">1. Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente ont pour objet de définir les droits et obligations 
                Loufa Pro
              </p>

              <h2 className="text-xl font-semibold text-foreground">2. Produits</h2>
              <p>
                Les produits proposés à la vente sont ceux présentés sur le site au moment de la consultation 
                par le client. Nous nous réservons le droit de modifier l'assortiment à tout moment.
              </p>

              <h2 className="text-xl font-semibold text-foreground">3. Prix</h2>
              <p>
                Les prix sont indiqués en Francs CFA (FCFA). Ils sont susceptibles de modification à tout moment 
                sans préavis. Le prix facturé est celui en vigueur au moment de la commande.
              </p>

              <h2 className="text-xl font-semibold text-foreground">4. Commande</h2>
              <p>
                La commande est passée via le site web. Elle est confirmée par l'envoi d'un message WhatsApp 
                au client avec le récapitulatif de sa commande.
              </p>

              <h2 className="text-xl font-semibold text-foreground">5. Paiement</h2>
              <p>
                Le paiement peut s'effectuer par : Wave, Orange Money, Free Money, ou espèces lors de la livraison.
              </p>

              <h2 className="text-xl font-semibold text-foreground">6. Livraison</h2>
              <p>
                Les livraisons sont effectuées dans un délai de 24 à 72 heures pour Dakar et 3 à 7 jours 
                pour les autres régions du Sénégal. Les frais de livraison sont gratuits pour les commandes 
                supérieures à 50 000 Fcfa.
              </p>

              <h2 className="text-xl font-semibold text-foreground">7. Retour et Remboursement</h2>
              <p>
                Vous disposez de 7 jours à compter de la réception pour retourner un produit. 
                Les frais de retour sont à votre charge sauf en cas de produit défectueux.
              </p>

              <h2 className="text-xl font-semibold text-foreground">8. Garantie</h2>
              <p>
                Tous nos produits électroniques bénéficient d'une garantie minimale de 6 mois. 
                La garantie ne couvre pas les dommages causés par une mauvaise utilisation.
              </p>

              <h2 className="text-xl font-semibold text-foreground">9. Responsabilité</h2>
              <p>
                Loufa Pro ne peut être tenu responsable des dommages résultant de l'utilisation 
                des produits achetés sur le site.
              </p>

              <h2 className="text-xl font-semibold text-foreground">10. Litiges</h2>
              <p>
                En cas de litige, une solution à l'amiable sera recherchée. À défaut, les tribunaux 
                de Dakar seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
            
            <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
              <h2 className="text-xl font-semibold text-foreground">1. Collecte des données</h2>
              <p>
                Nous collectons les données personnelles suivantes : nom, prénom, adresse email, 
                numéro de téléphone et adresse de livraison.
              </p>

              <h2 className="text-xl font-semibold text-foreground">2. Utilisation des données</h2>
              <p>
                Vos données sont utilisées pour : traiter vos commandes, vous contacter concernant 
                votre livraison, et améliorer nos services.
              </p>

              <h2 className="text-xl font-semibold text-foreground">3. Conservation des données</h2>
              <p>
                Vos données sont conservées pour une durée de 3 ans à compter de votre dernière commande.
              </p>

              <h2 className="text-xl font-semibold text-foreground">4. Vos droits</h2>
              <p>
                Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de 
                contact@loufapro.sn
              </p>

              <h2 className="text-xl font-semibold text-foreground">5. Sécurité</h2>
              <p>
                Nous mettons en œuvre toutes les mesures de sécurité nécessaires pour protéger 
                vos données personnelles.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-muted/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
            <p className="text-muted-foreground mb-4">
              Pour toute question concernant nos CGV ou notre politique de confidentialité, 
              n'hésitez pas à nous contacter.
            </p>
            <div className="space-y-2">
              contact@loufapro.sn
              <p><strong>WhatsApp:</strong> +221 76 755 89 76</p>
              <p><strong>Adresse:</strong> Dakar, Sénégal</p>
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
