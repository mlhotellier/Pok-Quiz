import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Pokedex = ({ navigation, pokemonData, isLoading }) => {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(pokemonData);

  useEffect(() => {
    if (search === '') {
      setFilteredData(pokemonData);
    } else {
      setFilteredData(
        pokemonData.filter(pokemon =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, pokemonData]);

  const navigateToPokemonDetails = (pokemon) => {
    navigation.navigate('PokemonDetails', { pokemon, pokemonData });
  };

  const pokeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToPokemonDetails(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un Pokémon"
          value={search}
          onChangeText={text => setSearch(text)}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={24} color="gray" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? (
        <Text>Chargement du Pokedex...</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={pokeCard}
          numColumns={3}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 25,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (Dimensions.get('window').width) - 20,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  clearIcon: {
    marginLeft: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    width: (Dimensions.get('window').width / 3) - 15, // Width divided by number of columns minus padding/margin
    margin: 5,
    padding: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
  },
  name: {
    marginTop: 10,
    fontSize: '14.5em',
    fontWeight: 'bold',
  },
});

export default Pokedex;