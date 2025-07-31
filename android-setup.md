# 📱 Guide de Compilation APK Android - FITNUTRI

## 🚀 Instructions Complètes pour Créer l'APK

### ⚠️ Prérequis Obligatoires

#### 1. **Java Development Kit (JDK)**
```bash
# Vérifier si Java est installé
java -version

# Si pas installé, télécharger JDK 17 ou 21
# https://adoptium.net/temurin/releases/
```

#### 2. **Android Studio**
- Télécharger depuis : https://developer.android.com/studio
- Installer avec les SDK par défaut
- Accepter toutes les licences Android

#### 3. **Variables d'Environnement**
```bash
# Ajouter au fichier ~/.bashrc ou ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Recharger le terminal
source ~/.bashrc
```

### 🔧 Étapes de Compilation

#### **Étape 1 : Préparation**
```bash
# Installer les dépendances
npm install

# Vérifier que Capacitor est installé
npx cap --version
```

#### **Étape 2 : Configuration Android**
```bash
# Ajouter la plateforme Android (une seule fois)
npm run android:setup

# Ou manuellement :
npx cap add android
```

#### **Étape 3 : Build et Synchronisation**
```bash
# Build de production + sync Android
npm run android:sync

# Ou étape par étape :
npm run build:prod
npx cap sync android
```

#### **Étape 4 : Ouvrir dans Android Studio**
```bash
# Ouvrir le projet Android
npm run android:open

# Ou manuellement :
npx cap open android
```

#### **Étape 5 : Générer l'APK dans Android Studio**

1. **Dans Android Studio :**
   - Cliquer sur `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Attendre la compilation (2-5 minutes)
   - Cliquer sur `locate` quand c'est terminé

2. **Localisation de l'APK :**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 📱 Installation sur Téléphone

#### **Option 1 : USB Debugging**
```bash
# Activer le mode développeur sur Android
# Paramètres → À propos → Appuyer 7x sur "Numéro de build"
# Paramètres → Options développeur → Débogage USB

# Connecter le téléphone et installer
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### **Option 2 : Transfert Manuel**
1. Copier `app-debug.apk` sur le téléphone
2. Ouvrir le fichier APK
3. Autoriser l'installation depuis sources inconnues
4. Installer l'application

### 🔒 APK de Production (Signé)

#### **Créer un Keystore**
```bash
# Générer une clé de signature
keytool -genkey -v -keystore fitnutri-release-key.keystore -alias fitnutri -keyalg RSA -keysize 2048 -validity 10000

# Garder le mot de passe en sécurité !
```

#### **Configuration Gradle**
Créer `android/app/build.gradle` avec la configuration de signature :

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../fitnutri-release-key.keystore')
            storePassword 'VOTRE_MOT_DE_PASSE'
            keyAlias 'fitnutri'
            keyPassword 'VOTRE_MOT_DE_PASSE'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### **Build Release**
```bash
# Dans Android Studio
Build → Generate Signed Bundle / APK → APK → Next
# Sélectionner le keystore et build
```

### 🐛 Résolution de Problèmes

#### **Erreur : ANDROID_HOME non défini**
```bash
# Vérifier les variables
echo $ANDROID_HOME
echo $PATH

# Redémarrer le terminal après configuration
```

#### **Erreur : Licences non acceptées**
```bash
# Accepter toutes les licences
yes | sdkmanager --licenses
```

#### **Erreur : Gradle Build Failed**
```bash
# Nettoyer et rebuilder
cd android
./gradlew clean
cd ..
npm run android:sync
```

#### **Erreur : Device not found**
```bash
# Vérifier les appareils connectés
adb devices

# Redémarrer adb si nécessaire
adb kill-server
adb start-server
```

### 📊 Tailles d'APK Attendues

- **Debug APK** : ~15-25 MB
- **Release APK** : ~8-15 MB (avec optimisations)
- **AAB (Play Store)** : ~6-10 MB

### 🚀 Distribution

#### **Pour Tests**
- Partager `app-debug.apk` directement
- Utiliser Firebase App Distribution
- Créer un lien de téléchargement

#### **Pour Production**
- Publier sur Google Play Store
- Utiliser le format AAB (Android App Bundle)
- Suivre les guidelines du Play Store

### 📝 Checklist Finale

- [ ] JDK installé et configuré
- [ ] Android Studio installé avec SDK
- [ ] Variables d'environnement configurées
- [ ] `npm install` exécuté
- [ ] `npm run android:setup` exécuté
- [ ] `npm run android:sync` réussi
- [ ] Android Studio ouvert sans erreurs
- [ ] APK généré avec succès
- [ ] APK testé sur appareil

### 🎯 Commandes Rapides

```bash
# Setup complet (première fois)
npm install
npm run android:setup
npm run android:sync
npm run android:open

# Build rapide (après modifications)
npm run android:sync
npm run android:open

# Debug sur appareil connecté
npx cap run android
```

---

**Une fois l'APK créé, il sera disponible dans :**
`android/app/build/outputs/apk/debug/app-debug.apk`

**Taille approximative :** 15-25 MB
**Compatible avec :** Android 7.0+ (API 24+)
**Permissions requises :** Caméra, Stockage, Vibration