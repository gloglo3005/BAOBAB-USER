# baobab-user

Interface React (Vite) pour le **lecteur**. Le staff et l'admin global ont leur projet : `baobab-administration`.

## Lancer

```bash
cp .env.example .env
npm install
npm run dev              # http://localhost:3000
```

Le backend Django doit tourner sur `http://localhost:8000`. Le port 3000 est autorisé par défaut
dans `CORS_ALLOWED_ORIGINS`.

## Fonctionnalités
- Connexion (JWT) et changement de mot de passe obligatoire.
- Mes bibliothèques : adhésions et leur statut, code de rattachement.
- Explorer : liste des bibliothèques, demande d'adhésion.
- Par bibliothèque : accueil (prêts à venir), catalogue (recherche, catégorie, disponibilité), détail d'un livre, mes prêts.

## Limites actuelles du backend
- Pas de route d'inscription : les comptes lecteurs sont créés ailleurs (admin Django ou formulaire `/reader/inscription/`).
- Pas de routes lecteur pour le coworking.
