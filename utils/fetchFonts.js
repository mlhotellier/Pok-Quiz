import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'pokemon-hollow': require('../assets/fonts/Pokemon Hollow.ttf'),
    'pokemon-solid': require('../assets/fonts/Pokemon Solid.ttf'),
    'pokemon-classic': require('../assets/fonts/Pokemon Classic.ttf'),
  });
};

export default fetchFonts;