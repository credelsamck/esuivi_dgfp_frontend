# eSuivi-DGFP — Frontend

Frontend React + TypeScript pour l'application eSuivi-DGFP (suivi de dossiers et réclamations, DGFP Bénin).

## Stack

- Vite + React + TypeScript
- React Router (routage par rôle : agent / gestionnaire / admin)
- Tailwind CSS v4
- axios (avec intercepteur Sanctum + gestion des 401)
- lucide-react (icônes)

## Démarrage

```bash
npm install
cp .env.example .env   # adapter VITE_API_BASE_URL vers votre backend Laravel
npm run dev
```

## Configuration de l'API

Le fichier `.env` doit pointer vers l'URL de base de l'API Laravel :

```
VITE_API_BASE_URL=http://localhost:8000/api
```

En production, remplacer par l'URL du backend déployé.

## Structure

```
src/
  components/   composants réutilisables (Button, Input, Modal, Timeline, StatCard, StatutBadge…)
  layouts/      layouts par espace (PublicHeader, AuthSplitLayout, AgentLayout, GestionnaireLayout, AdminLayout)
  pages/
    public/     Accueil, Connexion, Inscription, ConnexionPersonnel
    agent/      Tableau de bord, Mes dossiers, Réclamations, Nouvelle réclamation, Confirmation
    gestionnaire/  Tableau de bord, Gestion des dossiers, Gestion des réclamations
    admin/      Tableau de bord, Gestion des utilisateurs
  services/     api.ts (client axios), auth.tsx (contexte d'authentification)
  types/        types TypeScript correspondant aux réponses de l'API
```

## Rôles et routes protégées

- **Agent** : `/agent/*` — connexion via `/api/login`
- **Gestionnaire** / **Administrateur** : `/gestionnaire/*` et `/admin/*` — connexion commune via `/api/admin/login`, redirection selon le champ `role` renvoyé par l'API

Le token Sanctum est stocké dans `localStorage` et attaché automatiquement à chaque requête authentifiée.

## Build de production

```bash
npm run build
```

Les fichiers statiques sont générés dans `dist/`.
