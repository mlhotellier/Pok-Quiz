import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const PokeQuiz = ({ pokemonData }) => {
  const timeQuiz = 60; // Temps initial pour le quiz en secondes
  const [userInput, setUserInput] = useState('');
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(timeQuiz);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [minusFiveAnimation] = useState(new Animated.Value(0)); // Valeur d'animation pour le texte "-5"

  useEffect(() => {
    let interval;
    if (quizStarted) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 0) {
            handleEndQuiz();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted]);

  // Fonction pour démarrer le quiz
  const startQuiz = () => {
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    setRandomPokemon(random);
    setQuizStarted(true);
    setUserInput('');
    setTimer(timeQuiz);
    setScore(0);
    setQuizEnded(false);
  };

  // Fonction pour vérifier la réponse saisie par l'utilisateur
  const checkAnswer = (guessedName) => {
    if (guessedName.toLowerCase() === randomPokemon.name.toLowerCase()) {
      setScore(prevScore => prevScore + 1); // Augmenter le score si la réponse est correcte
      generateNewPokemon();
    }
    // Ne pas afficher d'alerte pour une réponse incorrecte
  };

  // Fonction pour générer et afficher un nouveau Pokémon aléatoire
  const generateNewPokemon = () => {
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    setRandomPokemon(random);
    setUserInput('');

    // Animer le texte "-5"
    Animated.sequence([
      Animated.timing(minusFiveAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(minusFiveAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Réduire le timer de 5 secondes, mais pas en dessous de 0
    setTimer(prevTimer => Math.max(prevTimer - 5, 0));
  };

  // Fonction pour régénérer un nouveau Pokémon en retirant 5 secondes au timer
  const regeneratePokemon = () => {
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    setRandomPokemon(random);
    setTimer(prevTimer => Math.max(prevTimer - 5, 0)); // Réduire le timer de 5 secondes, mais pas en dessous de 0

    // Animer le texte "-5"
    Animated.sequence([
      Animated.timing(minusFiveAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(minusFiveAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gestionnaire de changement pour le champ de texte
  const handleInputChange = (text) => {
    setUserInput(text);
  };

  // Gestionnaire de validation de l'input
  const handleCheckAnswer = () => {
    if (userInput.trim() === '') {
      return; // Ne rien faire si l'utilisateur n'a pas saisi de réponse
    }
    checkAnswer(userInput);
  };

  // Fonction pour terminer le quiz
  const handleEndQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(true);
    setUserInput('');
  };

  // Fonction pour retourner à l'accueil
  const navigateToHomeQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
  };

  if (!quizStarted && !quizEnded) {
    return (
      <View style={styles.container}>
        <View>
          <Text>Règles du quiz</Text>
          <Text>Vous avez {timeQuiz} secondes pour trouver le plus de Pokémons.</Text>
          <Text>Vous avez la possibilité de passer un Pokémon. Cela vous coûtera 5 secondes.</Text>
          <Text>Les mauvaises réponses ne sont pas pénalisées.</Text>
          <Text>Appuyez sur "Lancer le quiz" pour commencer !</Text>
          <Text>Bonne chance dresseur !</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Text style={styles.buttonText}>Lancer le quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizEnded) {
    return (
      <View style={styles.container}>
        <Text>Quiz terminé !</Text>
        <Text style={styles.resultText}>Félicitations !</Text>
        <Text style={styles.resultText}>Votre score : {score} {score === 1 ? 'Pokémon trouvé' : 'Pokémons trouvés'} en {timeQuiz} secondes.</Text>
        <Text>Retentez votre chance pour améliorer votre score !</Text>
        <Button title="Accueil" onPress={navigateToHomeQuiz} />
      </View>
    );
  }

  if (!randomPokemon) {
    return <Text>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Temps restant : {timer} secondes</Text>
      <Image source={{ uri: randomPokemon.image }} style={styles.image} />
      <Button title="Régénérer un Pokémon" onPress={regeneratePokemon} />
      <Text>Quel est le nom de ce Pokémon ?</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={userInput}
        placeholder="Entrez le nom du Pokémon"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.checkButton} onPress={handleCheckAnswer}>
        <Text style={styles.checkButtonText}>Vérifier</Text>
      </TouchableOpacity>

      {/* Animation "-5" */}
      <Animated.View style={[
        styles.minusFiveContainer,
        {
          opacity: minusFiveAnimation,
          transform: [
            {
              translateX: minusFiveAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 125], // Déplacer l'élément vers le haut
              }),
            },
          ],
        }
      ]}>
        <Text style={styles.minusFiveText}>-5</Text>
      </Animated.View>
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
  checkButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  minusFiveContainer: {
    position: 'absolute',
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusFiveText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default PokeQuiz;