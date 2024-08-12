import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Pokedex from '../screen/Pokedex';
import PokemonDetails from '../screen/PokemonDetails';
import PokeQuiz from '../screen/PokeQuiz';
import Profile from '../screen/Profile';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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

export default MainApp;