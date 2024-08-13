import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [bestChampionScore, setBestChampionScore] = useState(0);
  const [inputNickname, setInputNickname] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setNickname(data.nickname || '');
          setBestScore(data.bestScore || 0);
          setBestChampionScore(data.bestChampionScore || 0);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (user) {
      await firestore.collection('users').doc(user.uid).set({ nickname }, { merge: true });
      alert('Nickname updated!');
      setInputNickname(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Déconnexion de l'utilisateur
      navigation.navigate('Auth'); // Rediriger vers l'écran de connexion après la déconnexion
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditNickname = () => {
    setInputNickname(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {inputNickname ? 
            <TextInput
              placeholder="Enter your nickname"
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
            /> 
            : nickname
          }
          <TouchableOpacity onPress={handleEditNickname} style={styles.iconButton}>
            <Icon name="pencil" size={14} color="#000" />
          </TouchableOpacity>
        </Text>
        <Text style={styles.emailText}>Email: {user?.email}</Text>
        <Text style={styles.emailText}>Best score : {bestScore}</Text>
        <Text style={styles.emailText}>Best Champion score : {bestChampionScore}</Text>
      </View>
      {inputNickname && (
        <View style={styles.form}>
            <TextInput
                placeholder="Enter your nickname"
                value={nickname}
                onChangeText={setNickname}
                style={styles.input}
                />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.form}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#555',
  },
  iconButton: {
    borderRadius: 25,
    borderWidth:1,
    borderColor: 'grey',
    padding:2,    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 12,
    width: '80%',
  },
  form: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;