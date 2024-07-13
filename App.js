import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pokedex from './component/Pokedex';
import PokemonDetails from './component/PokemonDetails';
import PokeQuiz from './component/PokeQuiz';
import axios from 'axios';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
      setPokemonData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="PokedexStack">
        <Drawer.Screen name="PokedexStack" options={{ title: 'Pokedex'}}>
          {(props) => <PokedexStack {...props} pokemonData={pokemonData} isLoading={isLoading} />}
        </Drawer.Screen>
        <Drawer.Screen name="PokeQuiz" options={{ title: 'Poke Quiz'}}>
          {(props) => <PokeQuiz {...props} pokemonData={pokemonData} isLoading={isLoading} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
