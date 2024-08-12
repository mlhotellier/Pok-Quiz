import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pokedex from './screen/Pokedex';
import PokemonDetails from './screen/PokemonDetails';
import PokeQuiz from './screen/PokeQuiz';
import AuthScreen from './screen/Auth';
import Profile from './screen/Profile';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from './config/firebaseConfig'; // Assurez-vous que ce chemin est correct

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'pokemon-hollow': require('./assets/fonts/Pokemon Hollow.ttf'),
    'pokemon-solid': require('./assets/fonts/Pokemon Solid.ttf'),
    'pokemon-classic': require('./assets/fonts/Pokemon Classic.ttf'),
  });
};

const CustomDrawerContent = ({ navigation, isLoading, pokemonData }) => {
  return (
    <DrawerContentScrollView>
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
        label="PokéProfil"
        onPress={() => navigation.navigate('Profile')}
        icon={() => <Icon name="person-circle-outline" size={24} color="black" />}
      />
    </DrawerContentScrollView>
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
      drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} isLoading={isLoading} pokemonData={pokemonData} />}
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
      <Drawer.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [pokemonData, setPokemonData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Écoute les changements de l'état de connexion de l'utilisateur
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false); // On suppose que l'utilisateur est chargé à la fin
    });

    // Nettoie l'écouteur d'état de connexion lors du démontage du composant
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Charge les données de Pokémon uniquement si l'utilisateur est connecté
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
      setPokemonData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadResourcesAndDataAsync = async () => {
    try {
      await fetchFonts();
    } catch (e) {
      console.warn(e);
    } finally {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null; // Écran de chargement est géré par le Splash Screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "MainApp" : "Auth"}>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" options={{ headerShown: false }}>
          {(props) => <MainApp {...props} isLoading={isLoading} pokemonData={pokemonData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;