import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const QuizRules = ({ timeQuiz, masterMode, toggleSwitch, startQuiz, bestScore, bestChampionScore }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Règles du quiz</Text>
      <Text style={styles.rules}>
        Vous avez <Text style={styles.bold}>{timeQuiz} secondes</Text> pour trouver le plus de Pokémons.
      </Text>
      <Text style={styles.rules}>Les mauvaises réponses ne sont pas pénalisées.</Text>
      <Text style={styles.rules}>
        Si vous ne connaissez pas le Pokémon, vous avez la possibilité de <Text style={styles.bold}>regénérer un Pokémon</Text> en cliquant sur le
        bouton "Regénérer un Pokémon". Attention, cela vous coûtera <Text style={styles.bold}>5 secondes de pénalité</Text>.
      </Text>
      <Text style={styles.rules}>
        Choisissez votre mode de difficulté et appuyez sur "Lancer le quiz" pour démarrer !
      </Text>
      <Text style={styles.rules}>Bonne chance dresseur !</Text>
      <Text style={styles.difficulty}>Choix de la difficulté :</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, masterMode ? '' : styles.switchLabelSelected]}>Mode Débutant</Text>
        <Switch
          trackColor={{ false: 'grey', true: 'lightgrey' }}
          thumbColor={'red'}
          ios_backgroundColor="lightgrey"
          onValueChange={toggleSwitch}
          value={masterMode}
        />
        <Text style={[styles.switchLabel, masterMode ? styles.switchLabelSelected : '']}>Mode Champion</Text>
      </View>
      {!masterMode ? (
        <View>
          <Text style={[styles.textDifficulty, styles.starLevel]}>⭐️</Text>
          <Text style={styles.textDifficulty}>4 propositions vont s'afficher. Sélectionnez LA bonne réponse.</Text>
        </View>
      ) : (
        <View>
          <Text style={[styles.textDifficulty, styles.starLevel]}>⭐️⭐️⭐️</Text>
          <Text style={styles.textDifficulty}>Saisissez le nom exact du Pokémon. Attention aux accents !</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={startQuiz}>
        <Text style={styles.buttonText}>Lancer le quiz</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>Meilleur score : {!masterMode ? bestScore : bestChampionScore}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius:4,
    paddingTop:20,
    paddingBottom:20,
    paddingHorizontal:15,
  },
  bold: {
    fontWeight:'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontFamily: 'pokemon-solid',
  },
  difficulty: {
    fontSize: 16,
    marginTop:8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  starLevel: {
    fontSize:20,
    marginBottom:5,
  },
  textDifficulty: {
    fontSize: 16,
    textAlign:'center'
  },
  rules: {
    fontSize: 16,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  switchLabel: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'grey',
    textDecorationLine: 'line-through',
    textDecorationColor:'grey',
  },
  switchLabelSelected: {
    color: 'red',
    textDecorationLine: 'none',
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

export default QuizRules;