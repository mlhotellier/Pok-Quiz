import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import fetchFonts from './fetchFonts';

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
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

    loadResourcesAndDataAsync();
  }, []);

  return fontsLoaded;
};

export default useFonts;