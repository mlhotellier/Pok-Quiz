# PokeQuiz

**PokeQuiz** est une application mobile ludique et éducative basée sur l'univers Pokémon. Elle permet aux utilisateurs de tester leurs connaissances sur Pokémon grâce à différents quiz, de consulter un Pokédex interactif, et de participer à une ligue virtuelle.

## 📱 Fonctionnalités principales

- **PokéQuiz** : Répondez à des questions pour tester vos connaissances Pokémon.
- **Pokédex** : Explorez une base de données interactive avec des détails sur chaque Pokémon.
- **PokéLigue** : Participez à une ligue et gagnez des récompenses virtuelles.
- **Mon compte** : Gérez votre profil et vos scores.
  
---

## 🚀 Installation et configuration

### Prérequis

1. [Node.js](https://nodejs.org/) (version 18 ou supérieure).
2. [Expo CLI](https://expo.dev/) (installé globalement via `npm install -g expo-cli`).
3. Un compte Firebase avec un projet configuré.

### Étapes d'installation

1. **Clonez le dépôt** :
   
   ```bash
   git clone https://github.com/username/PokeQuiz.git
   cd PokeQuiz
   ```

Installez les dépendances :

    ```bash
    npm install
    ```

Créez un fichier .env : Copiez le contenu du fichier .env.example et remplissez-le avec vos informations Firebase :

```bash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID_IOS=your_firebase_app_id_ios
FIREBASE_APP_ID_ANDROID=your_firebase_app_id_android
```

Lancez l'application :

```bash
expo start
```

## 🛠️ Développement
Structure du projet
/assets : Contient les icônes, images, et autres ressources.
/components : Composants réutilisables de l'application.
/screens : Écrans principaux (PokéQuiz, Pokédex, etc.).
/context : Fournit les données globales (ex : contexte utilisateur).
/utils : Contient les fonctions utilitaires comme authUtils.js.
firebaseConfig.js : Configuration Firebase basée sur les variables d'environnement.

## Technologies utilisées
React Native : Framework principal.
Expo : Simplifie le développement mobile.
Firebase : Authentification, base de données, et stockage.

⚙️ Configuration Firebase
Allez sur Firebase Console.
Créez un projet ou utilisez un projet existant.
Configurez l'application Android et iOS :
Téléchargez le fichier google-services.json pour Android.
Téléchargez le fichier GoogleService-Info.plist pour iOS.
Placez les fichiers dans le dossier racine :
google-services.json pour Android.
GoogleService-Info.plist pour iOS.

## 🧪 Tests
L'application est testée manuellement sur des appareils Android et iOS.
Ajoutez des tests automatisés avec Jest si nécessaire.

## 🔐 Sécurité
Ne jamais exposer vos clés Firebase dans le dépôt. Utilisez un fichier .env pour stocker vos informations sensibles.
Ajoutez le fichier .env à votre .gitignore :

```bash
.env
```

## 📜 Licence
Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus d'informations.

## ✉️ Contact
Pour toute question ou suggestion, me contactez par mail à l'adresse mathislhotellier@gmail.com