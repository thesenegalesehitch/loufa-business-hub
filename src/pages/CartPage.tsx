import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Minus, Plus, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/cartStore';
import { LocationPicker } from '@/components/LocationPicker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis (min 2 caractères)').max(100),
  phone: z.string().trim().regex(/^(\+221|221)?[0-9]{9}$/, 'Numéro sénégalais invalide'),
  address: z.string().trim().min(5, 'Adresse requise (min 5 caractères)').max(200),
});

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('fr-SN').format(price);
  }, []);

  const totalPrice = getTotalPrice();
  const WHATSAPP_NUMBER = '221771234567'; // Replace with actual number

  const generateWhatsAppMessage = useCallback(() => {
    const itemsList = items
      .map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)} FCFA`)
      .join('\n');

    const mapsLink = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : 'Non spécifié';

    return `📦 *LOUFA BUSINESS - Nouvelle Commande*

${itemsList}

💰 *Total: ${formatPrice(totalPrice)} FCFA*

📍 *Livraison:* ${address}
🗺️ *Position:* ${mapsLink}

👤 *Client:* ${name}
📞 *Téléphone:* ${phone}

---
_Commande envoyée depuis Loufa Pro_`;
  }, [items, name, phone, address, location, totalPrice, formatPrice]);

  const handleSubmit = async () => {
    // Validate form
    const result = checkoutSchema.safeParse({ name, phone, address });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);

    try {
      // Save order to database
      const orderData = {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_address: address.trim(),
        latitude: location?.lat || null,
        longitude: location?.lng || null,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: totalPrice,
      };

      const { error } = await supabase.from('orders').insert(orderData);
      
      if (error) throw error;

      // Generate WhatsApp message
      const message = encodeURIComponent(generateWhatsAppMessage());
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      
      // Clear cart and redirect
      clearCart();
      window.open(whatsappUrl, '_blank');
      
      toast.success('Commande envoyée avec succès!', {
        description: 'Vous allez être redirigé vers WhatsApp',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Erreur lors de l\'envoi de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container-app py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
          <p className="text-muted-foreground">
            {isEmpty ? 'Votre panier est vide' : `${items.length} article${items.length > 1 ? 's' : ''}`}
          </p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/50 mb-6" />
            <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Link to="/">
              <Button className="btn-primary-gradient rounded-xl">
                Découvrir les produits
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-4 bg-card rounded-xl shadow-card"
                  >
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-primary font-bold">
                        {formatPrice(item.price)} FCFA
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
                <h2 className="text-xl font-bold">Récapitulatif</h2>
                
                <div className="space-y-2 pb-4 border-b">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate flex-1 mr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)} FCFA</span>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Informations de livraison
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Moussa Diop"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 123 45 67"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Quartier / Ville *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Parcelles Assainies, Dakar"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">Position exacte (optionnel)</Label>
                    <LocationPicker onLocationSelect={setLocation} />
                    {location && (
                      <p className="text-xs text-success mt-2">
                        ✓ Position sélectionnée
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full btn-whatsapp rounded-xl"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Envoi en cours...' : 'Commander sur WhatsApp'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                En cliquant, vous serez redirigé vers WhatsApp avec le récapitulatif de votre commande
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
