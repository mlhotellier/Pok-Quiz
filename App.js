import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screen/Auth';
import MainApp from './navigation/MainApp';
import axios from 'axios';
import useFonts from './utils/useFonts';
import { UserProvider, useUser } from './context/UserContext';
import LoadingScreen from './component/LoadingScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, loading: userLoading } = useUser();
  const [pokemonData, setPokemonData] = React.useState([]);
  const fontsLoaded = useFonts();

  React.useEffect(() => {
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

  if (!fontsLoaded || userLoading) {
    return <LoadingScreen />;  // Vous pouvez retourner un écran de chargement ici si nécessaire
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "MainApp" : "Auth"}>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" options={{ headerShown: false }}>
          {(props) => <MainApp {...props} isLoading={userLoading} pokemonData={pokemonData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;