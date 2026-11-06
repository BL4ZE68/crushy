# CRUSHY

Application mobile Expo / React Native en TypeScript, conçue pour Android et destinée à une seule personne.

## Base — design PLAYFUL LOVE

- Palette crème, rose gelée et cacao inspirée de Pip, avec thèmes clair et sombre.
- Nunito chargé localement (Regular, Bold et ExtraBold).
- Illustration de Pip fournie pour CRUSHY, affichée sur l’accueil et l’écran de bienvenue, avec flottement Reanimated désactivé si le système demande une réduction des animations.
- Composants et layouts adaptatifs avec gestion des zones de sécurité Android.

## Phase 2 — navigation et fondations techniques

- Expo Router avec accueil, jeux, boîte à surprises, musique et profil en onglets.
- Routes dédiées pour le splash, l’accueil initial, l’onboarding, l’humeur du jour, les jeux, les récompenses, les réglages et l’administration verrouillée.
- Zustand persistant pour le pseudo, le thème, l’humeur, les préférences de notification et les premières données de progression.
- React Hook Form + Zod pour valider l’onboarding.
- Client Supabase optionnel avec clé publishable seulement et sessions conservées dans SecureStore.
- Expo Notifications avec demande de permission explicite, Reanimated pour les animations, StyleSheet pour le design.

Les mini-jeux et la progression fonctionnent localement. Les surprises, citations, défis, questions et suggestions musicales publiés dans Supabase peuvent compléter les contenus intégrés.

## Phase 3 — mini-jeux

- Action ou vérité : cinq catégories, deux types de carte, questions aléatoires et possibilité de passer.
- Tu préfères ? : six dilemmes avec réponse et réaction pour chaque choix.
- Devine le mot : indices progressifs, réponses tolérant accents et ponctuation, trois tentatives.
- Quiz de personnalité : cinq questions à choix multiples et résultat déterministe.
- Défi chrono : dix tapes en douze secondes, réussite ou possibilité de réessayer.
- Les réussites alimentent l’XP, le total de parties et les badges concernés dans le profil.

Les contenus de jeux sont embarqués dans `src/games/gameData.ts`; leur administration à distance relève de la phase admin.

## Modules 5 à 9 — contenu, progression et profil

- **Surprises :** compliments, messages secrets, citations originales, lettres et blagues ; états lu/non lu/verrouillé/à venir, déblocages XP, ouverture animée et programmation locale date/heure. Une notification système est planifiée si les notifications sont autorisées.
- **Musique :** les six humeurs, recommandations de morceaux, filtres par genre, playlists Spotify personnalisées selon l’humeur et citations originales ; écoute sur Spotify, sans audio intégré.
- **Humeur du jour :** citation, blague, défi, pensée positive et question amusante adaptés à l’humeur, contenus stables pour la journée et défi quotidien récompensé une seule fois.
- **Récompenses :** niveaux XP, badges automatiques, récompense cachée, bonus XP de déblocage, animations respectant la réduction des animations et historique local des activités.
- **Mon espace :** pseudo validé avec Zod, avatars, humeur, progression, badges et accès aux réglages de notification.

Les horaires de programmation personnelle et les données de progression restent stockés localement sur l’appareil. Les contenus publiés par l’administrateur sont lus depuis Supabase quand le projet est configuré.

## Phase 10 — administration Supabase

- Connexion propriétaire par e-mail/mot de passe ; aucun formulaire d’inscription ou rôle admin n’est exposé dans l’application.
- Vérification du compte dans `admin_roles`, puis CRUD des surprises, citations, défis, questions Action/Vérité et Tu préfères ?, recommandations musicales et catégories.
- Programmation de publication des surprises et défis, brouillons/publication et statistiques protégées par une fonction SQL.
- Les données publiées alimentent la boîte à surprises, les contenus du jour, les suggestions musicales et les questions Action/Vérité / Tu préfères ?.
- Le contrôle visuel de la route admin n’est qu’une barrière UX : toutes les modifications et statistiques sont également filtrées côté base par RLS et `is_admin()`.
- La vue publique des questions ne retourne jamais les réponses privées.

## Expérience — états, sons et animations

- Une bannière signale la perte de connexion puis son rétablissement ; les contenus intégrés et la progression locale restent accessibles hors ligne.
- Les boutons principaux peuvent jouer un court son original, désactivé par défaut et configurable dans **Réglages → Sons**. L’application n’enregistre pas d’audio et ne demande aucune permission microphone.
- Les écrans et transitions respectent la préférence système de réduction des animations. Un bref effet de confettis accompagne le déblocage d’un nouveau badge.
- Chargements, erreurs de contenu en ligne et listes vides ont des états visuels dédiés ; les erreurs distantes sont journalisées sans remplacer les replis locaux.
- `expo-audio` est limité à la lecture au premier plan ; aucune lecture en arrière-plan n’est activée.

### Configuration Supabase

1. Crée un projet Supabase et exécute les migrations du dossier `supabase/migrations/` dans l’ordre chronologique.
2. Dans **Authentication → Settings**, désactive les inscriptions publiques, puis crée le compte du propriétaire dans **Authentication → Users**. Ne crée pas de compte admin en utilisant l’application.
3. Dans le SQL Editor, accorde le rôle au compte créé en remplaçant l’adresse ci-dessous :

   ```sql
   insert into public.admin_roles (user_id)
   select id from auth.users where lower(email) = lower('proprietaire@example.com')
   on conflict (user_id) do nothing;
   ```

4. Configure `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dans `.env`, puis redémarre Expo. N’utilise jamais la clé `service_role` dans l’application.

Les contenus publiés peuvent être lus anonymement ; l’écriture, les réponses aux questions et les statistiques admin sont protégées par les rôles et les politiques RLS. Les statistiques cloud comptent les activités enregistrées dans la base ; la progression actuelle (XP, jeux, lectures et historique) reste locale et est affichée séparément sur l’appareil.

## Démarrer

Prérequis : Node.js et npm.

```powershell
npm install
```

Le client Supabase reste désactivé tant que les variables ne sont pas renseignées. Copie le modèle puis complète uniquement l’URL du projet et sa **clé publishable** :

```powershell
Copy-Item .env.example .env
```

```env title=".env"
EXPO_PUBLIC_SUPABASE_URL=https://<projet>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<clé publishable>
```

Ne place jamais de clé `service_role` ou de secret Supabase dans l’application mobile.

```powershell
npm start
```

Dans Expo, appuyer sur `a` pour ouvrir l'application sur un émulateur Android, ou scanner le QR code avec Expo Go.

## Vérifications

```powershell
npm test
npm run typecheck
npm run android:export
```

## Architecture

- `src/app/` : routes Expo Router, parcours d’accueil et navigation par onglets.
- `src/admin/` : formulaires validés et accès aux opérations d’administration, soumis à RLS.
- `src/components/` : composants d’interface réutilisables.
- `src/lib/` : intégrations Supabase, contenus publiés et notifications.
- `supabase/migrations/` : schéma relationnel, vue publique sans réponses, fonction de rôle et politiques RLS.
- `src/games/`, `src/daily/`, `src/music/`, `src/rewards/` : règles et contenus métier.
- `src/store/` : préférences et état local persistant avec Zustand.
- `src/theme/` : palettes, tokens et sélection de thème.

## Écrans

| Écran | Route |
| --- | --- |
| Splash | `/` |
| Welcome | `/welcome` |
| Onboarding | `/onboarding` |
| Accueil | `/(tabs)` |
| Jeux | `/(tabs)/games` |
| Jeu | `/game/[slug]` |
| Surprises | `/(tabs)/surprises` |
| Musique | `/(tabs)/music` |
| Humeur du jour | `/daily` |
| Récompenses | `/rewards` |
| Profil | `/(tabs)/profile` |
| Réglages | `/settings` |
| Administration propriétaire | `/admin` |
