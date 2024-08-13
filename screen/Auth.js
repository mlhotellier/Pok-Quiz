import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import IconApp from '../assets/icon.png';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        // Inscription
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        await firestore.collection('users').doc(user.uid).set({
          email,
          nickname: '', // Initialisez avec une valeur vide
        });
      } else {
        // Connexion
        await auth.signInWithEmailAndPassword(email, password);
      }
      navigation.navigate('MainApp'); // Naviguer vers l'écran principal après connexion
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Ajustez ce décalage si nécessaire
    >
      <Image source={IconApp} style={styles.logo} />
      <Text style={styles.formTitle}>{isSignUp ? "Inscription" : "Connexion"}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isSignUp ? "S'inscrire" : "Se connecter"}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: '#adb5bd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginVertical: 10,
    marginBottom: 25,
    width: 'auto',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  formTitle: {
    fontSize:14,
    fontWeight:'bold',
    marginBottom:10,
  },
});

export default AuthScreen;