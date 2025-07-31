# Stage 1: Build de l'application Angular
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration npm
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application pour la production
RUN npm run build

# Stage 2: Serveur Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/dist/demo /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]