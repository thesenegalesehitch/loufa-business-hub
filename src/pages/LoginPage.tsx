import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success('Connexion en cours...');
    } catch (error) {
      toast.error('Erreur lors de la connexion avec Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mx-auto mb-4">
            <img src="/logo.jpg" alt="Loufa Pro" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">Connectez-vous pour accéder à votre panier</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-card space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading || loading}
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 h-12"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Connexion...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Se connecter avec Google
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                ou
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/panier')}
          >
            <Mail className="h-4 w-4 mr-2" />
           Continuer sans compte
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            En vous connectant, vous pourrez suivre vos commandes et retrouver votre panier
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
