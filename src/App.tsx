import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import FAQPage from "./pages/FAQPage";
import LegalPage from "./pages/LegalPage";
import WhatsAppChat from "./components/WhatsAppChat";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produit/:slug" element={<ProductDetailPage />} />
            <Route path="/categorie/:slug" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produit/:slug" element={<ProductDetailPage />} />
            <Route path="/categorie/:slug" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/mentions-legales" element={<LegalPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppChat />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
