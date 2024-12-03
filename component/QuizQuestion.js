// QuizQuestion.js

import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const QuizQuestion = ({
  randomPokemon,
  masterMode,
  timer,
  userInput,
  inputError,
  answers,
  selectedIncorrectAnswers,
  handleStopQuiz,
  generateNewPokemon,
  checkAnswer,
  handleInputChange,
  handleCheckAnswer,
  updateTimer,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.stopButton} onPress={handleStopQuiz}>
        <Text style={styles.stopButtonText}>Arrêter le quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.regenerateButton} onPress={updateTimer}>
        <Text style={styles.regenerateButtonText}>Régénérer un Pokémon</Text>
      </TouchableOpacity>
      <Image source={{ uri: randomPokemon.image }} style={styles.image} />
      <Text style={styles.timer}>Temps restant : {timer} secondes</Text>
      <View style={styles.answer}>
        <Text style={styles.prompt}>Quel est ce Pokémon ?</Text>
      </View>
      {!masterMode ? (
        <View style={styles.optionsContainer}>
          {answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedIncorrectAnswers.includes(index) && inputError && styles.optionError,
              ]}
              onPress={() => checkAnswer(answer, index)}
            >
              <Text style={styles.optionButtonText}>{answer}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          <TextInput
            style={[styles.input, inputError && styles.inputError]}
            onChangeText={handleInputChange}
            value={userInput}
            placeholder="Nom du Pokémon"
          />
          <TouchableOpacity style={styles.checkButton} onPress={() => handleCheckAnswer(userInput)}>
            <Text style={styles.checkButtonText}>Vérifier</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems:'center'
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answer: {
    paddingVertical:10,
    paddingHorizontal:25,
    marginVertical:10,
    width:(Dimensions.get('window').width) - 50,
    borderColor:'red',
    borderRadius:10,
    borderWidth:1,
  },
  prompt: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily:'pokemon-classic',
  },
  stopButton: {
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  regenerateButton: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    justifyContent:'space-around',
    width:Dimensions.get('window').width,
    marginVertical:15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingVertical:18,
    borderWidth:1,
    borderColor:'red',
    borderRadius: 5,
    margin:5,
    width:(Dimensions.get('window').width / 2) - 50,
  },
  optionButtonText: {
    color: '#222222',
    textTransform:'uppercase',
    fontSize: 15.2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionError: {
    backgroundColor: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: (Dimensions.get('window').width) - 50,
    paddingVertical:10,
    paddingHorizontal:25,
    marginVertical:10,
  },
  inputError: {
    borderColor: 'red',
  },
  checkButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuizQuestion;