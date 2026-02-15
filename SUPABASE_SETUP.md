# Configuration Admin Supabase - Instructions

## Problème: "invalid api key"

Cette erreur signifie que l'authentification Supabase n'est pas correctement configurée.

## Étapes pour corriger:

### 1. Activer l'authentification par email/password

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet: `cbfvybewbdansfltqubf`
3. Cliquez sur **Authentication** dans le menu de gauche
4. Cliquez sur **Providers** (ou "Méthodes de connexion")
5. Cliquez sur **Email/Password**
6. Activer **Enable Email Password** = ON
7. Activer **Enable Confirm Email** = OFF (pour les tests)
8. Cliquez **Save**

### 2. Configurer l'URL du site

1. Dans Authentication > **URL Configuration**
2. Ajoutez votre URL de site:
   - Pour développement local: `http://localhost:5173`
3. Sauvegardez

### 3. Créer un utilisateur admin

**Option A - Via Supabase Dashboard:**
1. Authentication > **Users**
2. Cliquez **Add user**
3. Entrez un email: `admin@loufa.sn` (ou autre)
4. Entrez un mot de passe: `Admin123!` 
5. Cliquez **Create user**
6. Copiez l'**user UUID** du nouvel utilisateur

**Option B - Via SQL Editor:**
1. Allez dans **SQL Editor**
2. Exécutez cette requête (remplacez USER_UUID par l'UUID copié):
```sql
INSERT INTO public.admin_users (user_id, email, role) 
VALUES ('USER_UUID', 'admin@loufa.sn', 'admin');
```

### 4. Tester la connexion

1. Redémarrez votre app: `npm run dev`
2. Allez sur `/admin`
3. Connectez-vous avec l'email et mot de passe créés

## Récupérer l'UUID d'un utilisateur:

```sql
SELECT id, email FROM auth.users;
```

## Si l'erreur persiste:

Vérifiez que les clés API dans `.env` sont correctes:
- `VITE_SUPABASE_URL` = `https://cbfvybewbdansfltqubf.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = doit commencer par `eyJ...`
