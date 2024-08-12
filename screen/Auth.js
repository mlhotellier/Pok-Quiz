import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import IconApp from '../assets/icon.png'

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
    <View style={styles.container}>
      <Image source={IconApp} style={styles.logo} />
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
      <Button title={isSignUp ? "Sign Up" : "Sign In"} onPress={handleAuth} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default AuthScreen;