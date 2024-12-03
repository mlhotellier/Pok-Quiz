import 'dotenv/config';

export default {
  expo: {
    name: "PokeQuiz",
    slug: "PokeQuiz",
    version: "1.0.0",
    orientation: "portrait",
    sdkVersion: "52.0.0",
    newArchEnabled: true,
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mlhotellier.PokeQuiz",
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mlhotellier.PokeQuiz",
      config: {
        googleServicesFile: "./google-services.json",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-font"],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppIdIos: process.env.FIREBASE_APP_ID_IOS,
      firebaseAppIdAndroid: process.env.FIREBASE_APP_ID_ANDROID,
      eas: {
        projectId: "4cbfadcb-667f-4168-8a3a-658224d14d15",
      },
    },
  },
};
