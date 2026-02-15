# 📋 Plan d'Action - Loufa Business Hub

## Priorisation: Sécurité > Core Features > UX > Performance

---

## 🔴 Phase 1: Sécurité (Priorité MAXIMUM)

### 1.1 Supprimer le login admin codé en dur
- [ ] Modifier AdminPage.tsx pour utiliser Supabase Auth
- [ ] Créer une politique pour vérifier le rôle admin
- [ ] Ajouter middleware de protection des routes admin

### 1.2 Configurer RLS strict
- [ ] Activer RLS sur toutes les tables
- [ ] Créer des politiques granulaires
- [ ] Tester les politiques de sécurité

### 1.3 Edge Functions (Backend)
- [ ] Créer fonction de validation admin
- [ ] Créer fonction de gestion stock
- [ ] Créer fonction de création commande

---

## 🟠 Phase 2: Fonctionnalités Core

### 2.1 Page Produit Détaillée
- [ ] Créer src/pages/ProductDetailPage.tsx
- [ ] Ajouter galerie d'images
- [ ] Ajouter sélecteur de variantes (taille/couleur)
- [ ] Ajouter bouton "Ajouter au panier"
- [ ] Ajouter produits recommandés

### 2.2 Gestion des Variantes
- [ ] Ajouter tables product_variants et product_options
- [ ] Mettre à jour les types TypeScript
- [ ] Créer composant de sélection de variante

### 2.3 Upload d'Images
- [ ] Configurer Supabase Storage (bucket 'products')
- [ ] Créer composant d'upload
- [ ] Ajouter compression d'images
- [ ] Implémenter lazy loading

### 2.4 Gestion du Stock
- [ ] Créer fonction RPC decrement_stock
- [ ] Déclencher lors de la création de commande
- [ ] Afficher "Rupture de stock" automatiquement

---

## 🟡 Phase 3: Expérience Utilisateur

### 3.1 Améliorer le Panier
- [ ] Sauvegarder le panier dans Supabase (pour utilisateurs connectés)
- [ ] Ajouter fonctionnalité "Sauvegarder pour plus tard"
- [ ] Ajouter fonctionnalité liste de souhaits

### 3.2 Page FAQ
- [ ] Créer src/pages/FAQPage.tsx
- [ ] Ajouter dans la navigation
- [ ] Questions fréquentes sur:
  - Livraison
  - Retours
  - Paiements
  - Garanties

### 3.3 Chat WhatsApp
- [ ] Ajouter bouton flottant WhatsApp
- [ ] Message pré-rempli avec le produit

---

## 🟢 Phase 4: Performance

### 4.1 Optimisation Images
- [ ] Convertir en WebP
- [ ] Implémenter responsive images (srcset)
- [ ] Ajouter placeholder de chargement

### 4.2 Cache & PWA
- [ ] Configurer Vite PWA
- [ ] Ajouter Service Worker
- [ ] Configurer caching offline

### 4.3 SEO
- [ ] Générer sitemap.xml
- [ ] Améliorer robots.txt
- [ ] Ajouter JSON-LD pour produits
- [ ] Meta tags dynamiques

---

## 🔵 Phase 5: Support Client

### 5.1 Page À Propos
- [ ] Mettre à jour le contenu
- [ ] Ajouter équipe/contact

### 5.2 Mentions Légales
- [ ] CGU/CGV
- [ ] Politique de confidentialité
- [ ] Politique de retour

---

## 📦 Livrables par Phase

### Phase 1
- [ ] Login admin sécurisé via Supabase
- [ ] RLS configuré sur toutes les tables

### Phase 2
- [ ] Page produit détaillée fonctionnelle
- [ ] Upload d'images fonctionnel
- [ ] Gestion des variantes fonctionnelle

### Phase 3 
- [ ] Panier avec sauvegarde cloud
- [ ] Page FAQ en ligne

### Phase 4
- [ ] PWA installable
- [ ] Images optimisées
- [ ] SEO complet

### Phase 5
- [ ] Site complet en production

---

## ⚡ Quick Wins (À faire maintenant)

1. **Corriger le CSS** ✅ (fait)
2. **Meta tags HTML** ✅ (fait)
3. **Supprimer le login hardcodé** 
4. **Lazy loading images** 
5. **Ajouter sitemap** - 30 min

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualisation production
npm run preview

# Linter
npm run lint
```
