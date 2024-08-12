import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import coupe from '../assets/coupe.png';

const QuizEndScreen = ({ masterMode, score, timeQuiz, navigateToHomeQuiz }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz terminé !</Text>
      <Image source={coupe} style={styles.image} />
      <Text style={styles.resultText}>
        Félicitations ! Vous avez terminé le quiz en mode {!masterMode ? 'Débutant' : 'Champion'}.
      </Text>
      <Text style={styles.resultText}>
        Votre score : {score} {score <= 1 ? 'Pokémon trouvé' : 'Pokémons trouvés'} en {timeQuiz} secondes.
      </Text>
      <Text style={styles.resultText}>Retentez votre chance pour améliorer votre score !</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToHomeQuiz}>
        <Text style={styles.buttonText}>Accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontFamily: 'pokemon-solid',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  rules: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuizEndScreen;