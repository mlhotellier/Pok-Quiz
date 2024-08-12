import React, { useState, useEffect } from 'react';
import QuizRules from '../component/QuizRules';
import QuizEndScreen from '../component/QuizEndScreen';
import QuizQuestion from '../component/QuizQuestion';
import { View, StyleSheet } from 'react-native';

const PokeQuiz = ({ pokemonData }) => {
  const timeQuiz = 60; // Temps initial pour le quiz en secondes
  const [userInput, setUserInput] = useState('');
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(timeQuiz);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestChampionScore, setBestChampionScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [masterMode, setMasterMode] = useState(false); // 'Débutant' ou 'Champion'
  const [answers, setAnswers] = useState([]);
  const [selectedIncorrectAnswers, setSelectedIncorrectAnswers] = useState([]);

  useEffect(() => {
    let interval;
    if (quizStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
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

  const startQuiz = () => {
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    setRandomPokemon(random);
    setQuizStarted(true);
    setTimer(timeQuiz);
    setScore(0);
    setQuizEnded(false);
    setInputError(false);
    setUserInput('');

    // Générer les réponses possibles pour le mode débutant
    if (!masterMode) {
      const options = generateOptions(random);
      setAnswers(options);
    }
  };

  const generateOptions = (pokemon) => {
    const options = [];
    options.push(pokemon.name); // Réponse correcte
    while (options.length < 4) {
      const randomOption = pokemonData[Math.floor(Math.random() * pokemonData.length)].name;
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    shuffleArray(options); // Mélanger les réponses
    return options;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const checkAnswer = (guessedName, index) => {
    if (guessedName.toLowerCase() === randomPokemon.name.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      generateNewPokemon();
    } else {
      setInputError(true);
      if (selectedIncorrectAnswers.length < 3) {
        setSelectedIncorrectAnswers([...selectedIncorrectAnswers, index]);
      }
    }
  };

  const handleClearError = () => {
    setInputError(false);
    setSelectedIncorrectAnswers([]);
  };

  const generateNewPokemon = () => {
    handleClearError();
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    setRandomPokemon(random);
    setUserInput('');

    // Regénérer les réponses possibles pour le mode débutant
    if (!masterMode) {
      const options = generateOptions(random);
      setAnswers(options);
      setSelectedIncorrectAnswers([]);
    }
  };

  const handleInputChange = (text) => {
    setUserInput(text);
    setInputError(false);
  };

  const handleCheckAnswer = (answer) => {
    if (userInput.trim() === '') {
      return;
    }
    checkAnswer(answer);
  };

  const handleEndQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(true);
    setUserInput('');
  };

  const handleStopQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setUserInput('');
    setTimer(timeQuiz);
    setScore(0);
    setInputError(false);
  };

  const navigateToHomeQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    updateBestScore();
  };

  const toggleSwitch = () => {
    setMasterMode(!masterMode);
  };

  const updateBestScore = () => {
    if (!masterMode) {
      setBestScore(score);
    } else {
      setBestChampionScore(score);
    }
  };

  const updateTimer = () => {
    setTimer((prevTimer) => Math.max(0, prevTimer - 5));
    generateNewPokemon();
  };

  if (!quizStarted && !quizEnded) {
    return (
      <View style={styles.container}>
        <QuizRules
          timeQuiz={timeQuiz}
          masterMode={masterMode}
          toggleSwitch={toggleSwitch}
          startQuiz={startQuiz}
          bestScore={bestScore}
          bestChampionScore={bestChampionScore}
        />
      </View>
    );
  }

  if (quizEnded) {
    return (
      <View style={styles.container}>
        <QuizEndScreen
          masterMode={masterMode}
          score={score}
          timeQuiz={timeQuiz}
          navigateToHomeQuiz={navigateToHomeQuiz}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuizQuestion
        randomPokemon={randomPokemon}
        masterMode={masterMode}
        timer={timer}
        userInput={userInput}
        inputError={inputError}
        answers={answers}
        selectedIncorrectAnswers={selectedIncorrectAnswers}
        handleStopQuiz={handleStopQuiz}
        generateNewPokemon={generateNewPokemon}
        checkAnswer={checkAnswer}
        handleInputChange={handleInputChange}
        handleCheckAnswer={handleCheckAnswer}
        updateTimer={updateTimer}
      />
    </View>
  );
};

export default PokeQuiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
})