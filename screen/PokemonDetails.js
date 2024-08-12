import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const PokemonDetails = ({ route }) => {
  const { pokemon, pokemonData } = route.params;

  const [currentIndex, setCurrentIndex] = useState(pokemonData.findIndex(p => p.id === pokemon.id));

  const goToNextPokemon = () => {
    const nextIndex = (currentIndex + 1) % pokemonData.length;
    setCurrentIndex(nextIndex);
  };

  const goToPreviousPokemon = () => {
    const previousIndex = (currentIndex - 1 + pokemonData.length) % pokemonData.length;
    setCurrentIndex(previousIndex);
  };

  const currentPokemon = pokemonData[currentIndex];
  // console.log(currentPokemon);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.details}>ID: {currentPokemon.id}</Text>
        <Text style={styles.details}>HP: {currentPokemon.stats.HP}</Text>
      </View>
      <View style={styles.mainContainer}>
        <Image source={{ uri: currentPokemon.image }} style={styles.image} />
        <Text style={styles.name}>{currentPokemon.name}</Text>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Types:</Text>
          <View style={styles.typesContainer}>
            {currentPokemon.apiTypes.map((type, index) => (
              <View key={index} style={styles.typeContainer}>
                <Image source={{ uri: type.image }} style={styles.typeImage} />
                <Text style={styles.typeText}>{type.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Attack: {currentPokemon.stats.attack}</Text>
        <Text style={styles.statsText}>Defense: {currentPokemon.stats.defense}</Text>
        <Text style={styles.statsText}>Special Attack: {currentPokemon.stats.special_attack}</Text>
        <Text style={styles.statsText}>Special Defense: {currentPokemon.stats.special_defense}</Text>
        <Text style={styles.statsText}>Speed: {currentPokemon.stats.speed}</Text>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton} onPress={goToPreviousPokemon}>
          <Text style={styles.buttonText}>Previous Pokemon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goToNextPokemon}>
          <Text style={styles.buttonText}>Next Pokemon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  topContainer: {
    display:'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    fontSize:18,
  },
  mainContainer: {
    alignItems:'center'
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 20,
    fontWeight:'500',
    marginBottom: 5,
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  typeImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  typeText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  statsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%', // Utilisation de 45% pour gérer l'espace entre les boutons
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PokemonDetails;