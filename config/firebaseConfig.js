import { Platform } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLmM2YVmJLqFgl8CtO1mcpCPvW064ofQ8",
  authDomain: "pokequiz-b56b7.firebaseapp.com",
  projectId: "pokequiz-b56b7",
  storageBucket: "pokequiz-b56b7.appspot.com",
  messagingSenderId: "200734293949",
  appId: Platform.OS === 'ios' 
    ? "1:200734293949:ios:dddb045a19bfbf05705cd4"
    : "1:200734293949:android:9ed8ee402dcca6d9705cd4",
};

// Initialise Firebase si ce n'est pas déjà fait
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };