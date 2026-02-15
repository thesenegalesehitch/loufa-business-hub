import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut,
  LayoutDashboard,
  Tags,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import type { Product, Category, Order } from '@/types/database';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';

type AdminTab = 'dashboard' | 'products' | 'orders';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    image_url: '',
    stock: '',
    status: 'active' as Product['status'],
    is_featured: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      setProducts((productsRes.data as unknown as Product[]) || []);
      setCategories((categoriesRes.data as unknown as Category[]) || []);
      setOrders((ordersRes.data as unknown as Order[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      
      // Authentification via Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Supabase auth error:', error);
        toast.error(error.message || 'Erreur de connexion');
        return;
      }
      
      if (!data.user) {
        toast.error('Aucun utilisateur trouvé');
        return;
      }
      
      console.log('User logged in:', data.user.id);
      
      // Vérifier si l'utilisateur est admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
        
      console.log('Admin check result:', adminData, adminError);
        
      if (adminError || !adminData) {
        await supabase.auth.signOut();
        toast.error('Accès admin refusé - utilisateur non autorisé');
        return;
      }
      
      setIsAuthenticated(true);
      fetchData();
      toast.success('Connexion réussie');
    } catch (error) {
      const err = error as Error;
      console.error('Full login error:', err);
      toast.error(err.message || 'Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success('Déconnexion réussie');
  };

  const handleSubmitProduct = async () => {
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: formData.description || null,
        price: parseInt(formData.price),
        original_price: formData.original_price ? parseInt(formData.original_price) : null,
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        stock: parseInt(formData.stock) || 0,
        status: formData.status,
        is_featured: formData.is_featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Produit modifié');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('Produit ajouté');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Produit supprimé');
      fetchData();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id: string, status: Product['status']) => {
    try {
      const { error } = await supabase.from('products').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success('Statut mis à jour');
      fetchData();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      original_price: '',
      category_id: '',
      image_url: '',
      stock: '',
      status: 'active',
      is_featured: false,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      stock: product.stock.toString(),
      status: product.status,
      is_featured: product.is_featured,
    });
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN').format(price);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <span className="font-bold">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              Voir le site
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container-app py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            <Package className="h-4 w-4 mr-2" />
            Produits
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Commandes
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Produits" 
                value={stats.totalProducts.toString()} 
                icon={Package}
                color="primary"
              />
              <StatCard 
                title="Commandes" 
                value={stats.totalOrders.toString()} 
                icon={ShoppingCart}
                color="success"
              />
              <StatCard 
                title="En attente" 
                value={stats.pendingOrders.toString()} 
                icon={ClipboardList}
                color="warning"
              />
              <StatCard 
                title="Revenus" 
                value={`${formatPrice(stats.totalRevenue)} FCFA`} 
                icon={Tags}
                color="accent"
              />
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestion des produits</h1>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="btn-primary-gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom du produit *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="iPhone 15 Pro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="iphone-15-pro"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description du produit..."
                        rows={3}
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Prix (FCFA) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="original_price">Prix barré (FCFA)</Label>
                        <Input
                          id="original_price"
                          type="number"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          placeholder="60000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Statut</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value as Product['status'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="top_vente">🔥 Top Vente</SelectItem>
                            <SelectItem value="promo">🏷️ Promo</SelectItem>
                            <SelectItem value="rupture">⛔ Rupture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Image du produit</Label>
                      <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label>Produit à la une</Label>
                    </div>

                    <Button
                      className="w-full btn-primary-gradient"
                      onClick={handleSubmitProduct}
                      disabled={!formData.name || !formData.price}
                    >
                      {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card"
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">📦</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-primary font-bold">
                        {formatPrice(product.price)} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <Select
                      value={product.status}
                      onValueChange={(value) => handleStatusChange(product.id, value as Product['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="top_vente">🔥 Top</SelectItem>
                        <SelectItem value="promo">🏷️ Promo</SelectItem>
                        <SelectItem value="rupture">⛔ Rupture</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold">Commandes récentes</h1>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune commande pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-card rounded-xl shadow-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-warning/10 text-warning' :
                        order.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                        order.status === 'delivered' ? 'bg-success/10 text-success' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {order.status === 'pending' ? '⏳ En attente' :
                         order.status === 'confirmed' ? '✓ Confirmé' :
                         order.status === 'delivered' ? '🚚 Livré' :
                         '✗ Annulé'}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1 mb-3">
                      {(order.items as { name: string; quantity: number; price: number }[]).map((item, i) => (
                        <p key={i} className="text-muted-foreground">
                          • {item.name} x{item.quantity}
                        </p>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        📍 {order.customer_address}
                      </p>
                      <p className="font-bold text-primary">
                        {formatPrice(order.total)} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }: { 
  title: string; 
  value: string; 
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'accent';
}) {
  const bgColors = {
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    accent: 'bg-accent/10',
  };
  
  const textColors = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-card">
      <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${textColors[color]}`} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

// Login Form Component
function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Loufa Pro</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow-card space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@loufabusiness.sn"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full btn-primary-gradient" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminPage;
