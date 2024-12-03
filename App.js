import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screen/Auth';
import MainApp from './navigation/MainApp';
import axios from 'axios';
import useFonts from './utils/useFonts';
import { UserProvider, useUser } from './context/UserContext';
import LoadingScreen from './component/LoadingScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// async function registerForPushNotificationsAsync() {
//   let token;

//   console.log('Is device physical?', Constants.isDevice);
//   if (Constants.isDevice) {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         alert('Failed to get push token for push notification!');
//         return;
//       }
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, loading: userLoading } = useUser();

  const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // Écoute les notifications reçues
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   // Écoute les interactions de l'utilisateur avec la notification
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  const [pokemonData, setPokemonData] = useState([]);
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
          {(props) => <MainApp {...props} isLoading={userLoading} pokemonData={pokemonData} expoPushToken={expoPushToken} />}
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
