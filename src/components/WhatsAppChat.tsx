import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '221767558976';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const quickMessages = [
    "Bonjour, j'ai une question sur un produit",
    "Je voudrais passer une commande",
    "Information sur la livraison",
    "Autre question"
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Loufa Business</p>
                <p className="text-xs opacity-90">En ligne</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 bg-gray-50 min-h-[200px]">
            <p className="text-sm text-gray-600 mb-4">
              👋 Bonjour ! Comment pouvons-nous vous aider ?
            </p>
            
            <div className="space-y-2">
              {quickMessages.map((msg, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left p-3 bg-white border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {msg}
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white border-t text-center">
            <p className="text-xs text-muted-foreground">
              Réponse rapide sur WhatsApp
            </p>
          </div>
        </motion.div>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg transition-transform hover:scale-110"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

// Need to add motion for the chat window
import { motion } from 'framer-motion';

export default WhatsAppChat;
