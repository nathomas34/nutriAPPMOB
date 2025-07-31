# 🏋️ FITNUTRI - Application de Calcul Nutritionnel et Musculation

## 📋 Description

FITNUTRI est une application Angular moderne dédiée à l'évaluation nutritionnelle personnalisée et à la planification de menus pour les objectifs de musculation et fitness. L'application calcule automatiquement les besoins caloriques, propose des menus adaptés et permet le suivi d'objectifs personnalisés.

## ✨ Fonctionnalités Principales

### 🧮 Calculs Nutritionnels Avancés
- **BMR (Métabolisme de Base)** : Calcul selon la formule Harris-Benedict révisée
- **TDEE (Dépense Énergétique Totale)** : Adaptation selon le niveau d'activité
- **IMC et Composition Corporelle** : Analyse complète avec catégorisation
- **Macronutriments** : Répartition personnalisée selon l'objectif
- **Besoins Hydriques** : Calcul des besoins en eau quotidiens

### 🍽️ Base de Données de Menus
- **75+ Menus Spécialisés** : 25+ menus par objectif (perte de poids, prise de masse, maintien)
- **Catégorisation Complète** : Petit-déjeuner, déjeuner, dîner, collations
- **Informations Détaillées** : Calories, macros, temps de préparation, difficulté
- **Système de Favoris** : Sauvegarde des menus préférés
- **Recherche Avancée** : Filtrage par ingrédients, catégorie, difficulté

### 🎯 Suivi d'Objectifs
- **Objectifs Parallèles** : Création de multiples objectifs simultanés
- **Suivi de Progression** : Calcul automatique des pourcentages d'avancement
- **Objectifs Suggérés** : Génération automatique selon le profil utilisateur
- **Alertes d'Échéance** : Notifications pour les objectifs proches de l'expiration

### 📊 Tableaux de Bord
- **Dashboard Personnalisé** : Vue d'ensemble des métriques importantes
- **Analyses Détaillées** : Graphiques et explications des calculs
- **Recommandations** : Conseils personnalisés nutrition et entraînement
- **Planificateur Hebdomadaire** : Génération automatique de plans repas

## 🛠️ Technologies Utilisées

- **Frontend** : Angular 20.0.0
- **Langage** : TypeScript 5.8.2
- **Styling** : CSS3 avec variables personnalisées
- **Architecture** : Composants standalone, services injectables
- **Responsive** : Design mobile-first adaptatif

## 📦 Installation et Démarrage

### 📱 **TÉLÉCHARGEMENT APK ANDROID**

**🎉 APK Android maintenant disponible !**

#### **Téléchargement Direct**
1. **Compiler l'APK** (voir instructions ci-dessous)
2. **Installer** sur votre téléphone Android
3. **Profiter** de l'app native complète !

#### **Instructions de Compilation**
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer Android (première fois seulement)
npm run android:setup

# 3. Compiler et ouvrir dans Android Studio
npm run android:build

# 4. Dans Android Studio : Build → Build APK(s)
# L'APK sera dans : android/app/build/outputs/apk/debug/
```

**📋 Prérequis :** Java JDK, Android Studio
**📖 Guide détaillé :** Voir `android-setup.md`

### 🌐 **Option 1 : Utilisation Web Locale**

**Pour utiliser l'application maintenant :**

1. **Clonez le projet** :
   ```bash
   git clone <repository-url>
   cd fitnutri
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Lancez l'application** :
   ```bash
   npm start
   ```

4. **Ouvrez dans votre navigateur** : `http://localhost:4200`

### 📱 **Option 2 : Installation PWA (Après Déploiement)**

**Une fois l'app déployée en ligne, vous pourrez :**

#### Sur Android (Chrome)
1. Ouvrir l'app web dans Chrome
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. L'app s'installera comme une app native

#### Sur iOS (Safari)
1. Ouvrir l'app web dans Safari
2. Bouton Partager 📤 → "Sur l'écran d'accueil"
3. L'app fonctionnera comme une app native

### 🚀 **Option 3 : Créer un Vrai APK (Pour Développeurs)**

**Si vous voulez créer un APK Android :**

1. **Installer Capacitor** :
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Ajouter la plateforme Android** :
   ```bash
   npx cap add android
   ```

3. **Build et sync** :
   ```bash
   npm run build
   npx cap sync android
   ```

4. **Ouvrir dans Android Studio** :
   ```bash
   npx cap open android
   ```

5. **Générer l'APK** depuis Android Studio

### 🌍 **Option 4 : Déploiement Web Public**

**Pour rendre l'app accessible à tous :**

#### Netlify (Gratuit)
```bash
npm run build:prod
# Glisser-déposer le dossier dist/demo sur netlify.com
```

#### Vercel (Gratuit)
```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages (Gratuit)
```bash
# Push sur GitHub, activer Pages dans les paramètres
```

### 🔧 Développement Local

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Angular CLI

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd fitnutri

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:4200` et se rechargera automatiquement lors des modifications.

### Build de Production
```bash
# Build optimisé pour la production
npm run build

# Les fichiers seront générés dans le dossier dist/
```

### 🚀 Déploiement

**Pour déployer votre propre version :**

#### Netlify (Recommandé)
1. Forkez ce repository
2. Connectez votre compte GitHub à Netlify
3. Sélectionnez le repository forké
4. Configuration automatique détectée
5. Déployez en un clic !

#### Vercel
1. Installez Vercel CLI : `npm i -g vercel`
2. Exécutez : `vercel --prod`
3. Suivez les instructions

#### GitHub Pages
1. Activez GitHub Pages dans les paramètres du repository
2. Configurez la source sur `gh-pages` branch
3. L'application sera disponible sur `https://username.github.io/fitnutri`

## 🐳 Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/demo /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Commandes Docker
```bash
# Construire l'image
docker build -t fitnutri .

# Lancer le conteneur
docker run -p 8080:80 fitnutri
```

## 🏗️ Architecture du Projet

```
src/
├── components/           # Composants Angular
│   ├── user-profile.component.ts
│   ├── nutrition-results.component.ts
│   ├── menu-planner.component.ts
│   └── goals-tracker.component.ts
├── services/            # Services métier
│   ├── nutrition-calculator.service.ts
│   ├── menu.service.ts
│   └── goal.service.ts
├── models/              # Interfaces TypeScript
│   └── user.model.ts
├── main.ts              # Point d'entrée principal
├── global_styles.css    # Styles globaux
└── index.html           # Template HTML
```

## 🧪 Formules de Calcul

### BMR (Métabolisme de Base)
**Hommes** : BMR = 88.362 + (13.397 × poids) + (4.799 × taille) - (5.677 × âge)
**Femmes** : BMR = 447.593 + (9.247 × poids) + (3.098 × taille) - (4.330 × âge)

### TDEE (Dépense Énergétique Totale)
- **Sédentaire** : BMR × 1.2
- **Légèrement actif** : BMR × 1.375
- **Modérément actif** : BMR × 1.55
- **Très actif** : BMR × 1.725
- **Extrêmement actif** : BMR × 1.9

### Objectifs Caloriques
- **Perte de poids** : TDEE - 500 calories (≈ 0.5kg/semaine)
- **Prise de masse** : TDEE + 300 calories (prise contrôlée)
- **Maintien** : TDEE

### Répartition Macronutriments

#### Perte de Poids
- Protéines : 35% (4 cal/g)
- Glucides : 30% (4 cal/g)
- Lipides : 35% (9 cal/g)

#### Prise de Masse
- Protéines : 25%
- Glucides : 50%
- Lipides : 25%

#### Maintien
- Protéines : 30%
- Glucides : 40%
- Lipides : 30%

## 📱 Fonctionnalités par Composant

### UserProfileComponent
- Saisie des données personnelles (âge, sexe, taille, poids)
- Sélection du niveau d'activité et objectif principal
- Validation des données et génération du profil

### NutritionResultsComponent
- Affichage des calculs nutritionnels (BMR, TDEE, macros)
- Catégorisation IMC et masse grasse
- Recommandations personnalisées avec explications

### MenuPlannerComponent
- Navigation par onglets (Parcourir, Plan hebdomadaire, Favoris)
- Système de recherche et filtrage avancé
- Affichage détaillé des recettes avec modal
- Génération automatique de plans hebdomadaires

### GoalsTrackerComponent
- Création d'objectifs personnalisés ou suggérés
- Suivi de progression avec barres visuelles
- Gestion des échéances et alertes
- Actions rapides de mise à jour

## 🎨 Design System

### Palette de Couleurs
- **Primaire** : Orange (#FF6B35) - Énergie et motivation
- **Secondaire** : Cyan (#00D4FF) - Fraîcheur et performance
- **Accent** : Or (#FFD700) - Excellence et réussite
- **Succès** : Vert (#00FF88) - Validation et progrès
- **Attention** : Jaune (#FFB800) - Alertes importantes
- **Erreur** : Rouge (#FF4757) - Problèmes et limites

### Typographie
- **Police** : Inter (Google Fonts)
- **Poids** : 300-900 (Light à Black)
- **Hiérarchie** : Titres en bold/black, texte en regular/medium

### Composants UI
- **Cards** : Arrière-plan dégradé avec bordures lumineuses
- **Boutons** : Effets de glow et animations de survol
- **Formulaires** : Inputs avec focus states et validation
- **Barres de progression** : Animations et effets rayés

## 🔧 Configuration

### Variables d'Environnement
```typescript
// Aucune variable d'environnement requise
// L'application fonctionne entièrement côté client
```

### Personnalisation des Calculs
Les formules peuvent être ajustées dans `nutrition-calculator.service.ts` :
- Multiplicateurs d'activité
- Déficits/surplus caloriques
- Ratios de macronutriments

## 📈 Évolutions Futures

### Fonctionnalités Prévues
- **Intégration API** : Connexion à des bases de données nutritionnelles
- **Graphiques Avancés** : Charts.js pour visualisations
- **Export PDF** : Génération de rapports personnalisés
- **Mode Hors-ligne** : Service Worker pour utilisation offline
- **Notifications Push** : Rappels et encouragements
- **Communauté** : Partage de menus et objectifs

### Améliorations Techniques
- **Tests Unitaires** : Couverture complète avec Jasmine/Karma
- **PWA** : Transformation en Progressive Web App
- **Internationalisation** : Support multi-langues
- **Accessibilité** : Conformité WCAG 2.1
- **Performance** : Lazy loading et optimisations

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ⚠️ Avertissements

- Les calculs sont fournis à titre informatif uniquement
- Consultez un professionnel de santé avant tout changement alimentaire majeur
- Les recommandations ne remplacent pas un suivi médical personnalisé
- L'application ne stocke aucune donnée personnelle sur des serveurs externes

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation technique
- Vérifier les formules de calcul dans le code source

---

**FITNUTRI** - Votre coach nutrition & musculation personnalisé by Nathomas34 💪
