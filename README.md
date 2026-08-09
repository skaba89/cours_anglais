Exit code: 0
Wall time: 5.9 seconds
Output:
# Hello! — English, spoken.

Application web mobile d’apprentissage de l’anglais conçue pour les francophones. La méthode C.L.A.I.R. relie contexte, vocabulaire, rappel actif, interaction et révision.

## Version actuelle

- parcours du niveau A1 au C2 avec 36 modules dans la feuille de route ;
- bêta comprenant 24 expressions guidées et 6 épisodes interactifs ;
- voix britanniques et américaines, féminines et masculines ;
- exercices d’écoute, répétition, rappel et jeu de rôle ;
- compte apprenant, progression locale et synchronisation D1 sur le site hébergé ;
- pages Confidentialité, Conditions et Assistance.

Les scores de prononciation sont des indicateurs pédagogiques internes et non une certification CECRL officielle.

## Développement

Node.js `>=22.13.0` est requis.

```bash
npm install
npm run dev
npm run check
```

`npm run check` exécute le lint, les tests produit et le build de production. Après une modification de `db/schema.ts`, utilisez `npm run db:generate` pour créer la migration D1 correspondante.

## Déploiement

Le projet utilise Vinext, Cloudflare Workers, D1 et Sites. L’authentification du compte hébergé repose sur les en-têtes d’identité fournis par la plateforme ; aucun mot de passe n’est stocké par l’application.

Avant l’ouverture des paiements, compléter l’identité juridique de l’éditeur, les coordonnées d’assistance, les conditions de vente et connecter un prestataire de paiement avec gestion des droits Premium côté serveur.

