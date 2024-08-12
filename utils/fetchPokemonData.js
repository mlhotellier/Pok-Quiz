import axios from 'axios';

const fetchPokemonData = async () => {
  try {
    const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchPokemonData;