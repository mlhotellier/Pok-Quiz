import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from './config/firebaseConfig';
import AuthScreen from './screen/Auth';
import MainApp from './navigation/MainApp';
import axios from 'axios';
import useFonts from './utils/useFonts';  // Assurez-vous que le chemin est correct

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [user, setUser] = useState(null);
  const fontsLoaded = useFonts();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
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

  if (!fontsLoaded || isLoading) {
    return null;  // Vous pouvez retourner un écran de chargement ici si nécessaire
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
