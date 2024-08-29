import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Pokedex from '../screen/Pokedex';
import PokemonDetails from '../screen/PokemonDetails';
import PokeQuiz from '../screen/PokeQuiz';
import Profile from '../screen/Profile';
import PokeLigue from '../screen/PokeLigue';
import { handleSignOut } from '../utils/authUtils';
import { auth, firestore } from '../config/firebaseConfig';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const userDocRef = firestore.collection('users').doc(user.uid);
        userDocRef.get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setNickname(data.nickname || 'No Nickname');
              setProfileImage(data.profileImage || null);
            } else {
              setError('No such document!');
            }
            setLoading(false);
          })
          .catch((err) => {
            setError('Error getting document: ' + err.message);
            setLoading(false);
          });
      } else {
        // Réinitialisez les états lorsque l'utilisateur est déconnecté
        setUser(null);
        setNickname('');
        setProfileImage(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <View style={styles.profileContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
            style={styles.profileImage}
          />
          <Text style={styles.nickname}>{nickname}</Text>
        </View>

        <DrawerItem
          label="PokeQuiz"
          onPress={() => navigation.navigate('PokeQuiz')}
          icon={() => <Icon name="game-controller" size={24} color="black" />}
        />
        <DrawerItem
          label="Pokédex"
          onPress={() => navigation.navigate('PokedexStack')}
          icon={() => <Icon name="list" size={24} color="black" />}
        />
        <DrawerItem
          label="PokéLigue"
          onPress={() => navigation.navigate('PokeLigue')}
          icon={() => <Icon name="trophy" size={24} color="black" />}
        />
        <DrawerItem
          label="Mon compte"
          onPress={() => navigation.navigate('Profile')}
          icon={() => <Icon name="person-circle-outline" size={24} color="black" />}
        />
      </DrawerContentScrollView>

      <View style={styles.signOutContainer}>
        <TouchableOpacity onPress={() => handleSignOut(navigation)} style={styles.signOutButton}>
          <Icon name="log-out-outline" size={24} color="red" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PokedexStack = ({ pokemonData, isLoading }) => {
  return (
    <Stack.Navigator initialRouteName="PokedexScreen">
      <Stack.Screen name="PokedexScreen" options={{ title: 'Pokedex', headerShown: false }}>
        {(props) => <Pokedex {...props} pokemonData={pokemonData} isLoading={isLoading} />}
      </Stack.Screen>
      <Stack.Screen name="PokemonDetails" component={PokemonDetails} options={{ title: 'Pokémon Details' }} />
    </Stack.Navigator>
  );
};

const MainApp = ({ isLoading, pokemonData }) => {
  return (
    <Drawer.Navigator
      initialRouteName="PokeQuiz"
      drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'red',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 21,
          letterSpacing: 1.2,
          fontFamily: 'pokemon-solid',
        },
        drawerStyle: {
          backgroundColor: '#fafafa',
          width: 240,
        },
        drawerContentOptions: {
          activeTintColor: 'red',
        },
      }}
    >
      <Drawer.Screen name="PokeQuiz" options={{ title: 'PokéQuiz' }}>
        {(drawerProps) => <PokeQuiz {...drawerProps} pokemonData={pokemonData} isLoading={isLoading} />}
      </Drawer.Screen>
      <Drawer.Screen name="PokedexStack" options={{ title: 'Pokédex' }}>
        {(drawerProps) => <PokedexStack {...drawerProps} pokemonData={pokemonData} isLoading={isLoading} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="PokeLigue"
        component={PokeLigue}
        options={{ title: 'PokéLigue' }}
      />
      <Drawer.Screen name="Profile" options={{ title: 'Mon compte' }}>
        {(drawerProps) => <Profile {...drawerProps} pokemonData={pokemonData} isLoading={isLoading} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  signOutContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 30,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default MainApp;