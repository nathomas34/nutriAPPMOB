# 🚀 Guide de Déploiement FITNUTRI

## 📋 Options de Déploiement

### 1. 🐳 Déploiement avec Docker (Recommandé)

#### Déploiement Simple
```bash
# Construire l'image
docker build -t fitnutri .

# Lancer le conteneur
docker run -d -p 8080:80 --name fitnutri-app fitnutri

# Accéder à l'application
# http://localhost:8080
```

#### Déploiement avec Docker Compose
```bash
# Déploiement production
docker-compose up -d

# Déploiement développement avec hot reload
docker-compose --profile dev up -d

# Arrêter les services
docker-compose down
```

### 2. ☁️ Déploiement Cloud

#### Netlify
```bash
# Build de l'application
npm run build

# Déployer le dossier dist/demo sur Netlify
# Configuration: Build command: npm run build
# Publish directory: dist/demo
```

#### Vercel
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod

# Configuration automatique pour Angular
```

#### AWS S3 + CloudFront
```bash
# Build de l'application
npm run build

# Synchroniser avec S3
aws s3 sync dist/demo/ s3://your-bucket-name --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 3. 🖥️ Déploiement Serveur Traditionnel

#### Nginx
```bash
# Build de l'application
npm run build

# Copier les fichiers vers le serveur web
sudo cp -r dist/demo/* /var/www/html/

# Configuration Nginx (voir nginx.conf)
sudo systemctl reload nginx
```

#### Apache
```bash
# Build de l'application
npm run build

# Copier les fichiers
sudo cp -r dist/demo/* /var/www/html/

# Configuration .htaccess pour SPA
echo "RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]" > dist/demo/.htaccess
```

## 🔧 Configuration de Production

### Variables d'Environnement
```bash
# Aucune variable requise pour cette version
# L'application fonctionne entièrement côté client
```

### Optimisations de Performance
```bash
# Build avec optimisations maximales
ng build --configuration=production --aot --build-optimizer

# Analyse du bundle
npm install -g webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/demo/stats.json
```

### Configuration SSL/HTTPS
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📊 Monitoring et Logs

### Docker Logs
```bash
# Voir les logs du conteneur
docker logs fitnutri-app

# Suivre les logs en temps réel
docker logs -f fitnutri-app

# Logs avec timestamps
docker logs -t fitnutri-app
```

### Nginx Logs
```bash
# Logs d'accès
tail -f /var/log/nginx/access.log

# Logs d'erreur
tail -f /var/log/nginx/error.log

# Analyse des logs avec GoAccess
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

## 🔒 Sécurité

### Headers de Sécurité
```nginx
# Headers de sécurité (déjà inclus dans nginx.conf)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;" always;
```

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy FITNUTRI

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Build Docker image
      run: docker build -t fitnutri:${{ github.sha }} .
    
    - name: Deploy to production
      run: |
        # Commandes de déploiement spécifiques à votre infrastructure
        echo "Deploying to production..."
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t fitnutri .
    - docker run -d -p 8080:80 fitnutri
  only:
    - main
```

## 📈 Scaling et Performance

### Load Balancing avec Nginx
```nginx
upstream fitnutri_backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}

server {
    listen 80;
    location / {
        proxy_pass http://fitnutri_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Swarm
```bash
# Initialiser le swarm
docker swarm init

# Créer un service
docker service create \
  --name fitnutri \
  --replicas 3 \
  --publish 8080:80 \
  fitnutri:latest

# Scaler le service
docker service scale fitnutri=5
```

### Kubernetes
```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fitnutri-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fitnutri
  template:
    metadata:
      labels:
        app: fitnutri
    spec:
      containers:
      - name: fitnutri
        image: fitnutri:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: fitnutri-service
spec:
  selector:
    app: fitnutri
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔧 Maintenance

### Mise à Jour
```bash
# Arrêter l'ancien conteneur
docker stop fitnutri-app
docker rm fitnutri-app

# Construire la nouvelle version
docker build -t fitnutri:latest .

# Lancer le nouveau conteneur
docker run -d -p 8080:80 --name fitnutri-app fitnutri:latest
```

### Sauvegarde
```bash
# Sauvegarder l'image Docker
docker save fitnutri:latest | gzip > fitnutri-backup.tar.gz

# Restaurer l'image
gunzip -c fitnutri-backup.tar.gz | docker load
```

### Health Checks
```dockerfile
# Ajouter au Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

## 📞 Support et Dépannage

### Problèmes Courants

#### L'application ne se charge pas
```bash
# Vérifier les logs
docker logs fitnutri-app

# Vérifier que le port est ouvert
netstat -tlnp | grep :8080

# Tester la connectivité
curl -I http://localhost:8080
```

#### Erreur 404 sur les routes Angular
```nginx
# S'assurer que la configuration Nginx inclut
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Performance lente
```bash
# Vérifier l'utilisation des ressources
docker stats fitnutri-app

# Optimiser les images
docker system prune -a
```

---

Pour toute question sur le déploiement, consultez la documentation ou ouvrez une issue sur GitHub.