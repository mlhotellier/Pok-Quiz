import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { firestore } from '../config/firebaseConfig'; // Assurez-vous que ce chemin est correct
import bgImageHeader from '../assets/bg-profile-header.jpg';

const PokeLigue = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState(true); // Par défaut, mode Débutant

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const usersCollection = firestore.collection('users').limit(10); // Limite à 10 utilisateurs
        const snapshot = await usersCollection.get();
        const usersScores = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            nickname: data.nickname || 'No Nickname',
            bestScore: data.bestScore || 0,
            bestChampionScore: data.bestChampionScore || 0,
            profileImage: data.profileImage || null, // Ajout de l'image de profil
          };
        });

        // Trier les utilisateurs en fonction du mode sélectionné
        usersScores.sort((a, b) => {
          if (sortMode) {
            return b.bestScore - a.bestScore;
          } else {
            return b.bestChampionScore - a.bestChampionScore;
          }
        });

        setScores(usersScores);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [sortMode]); // Re-fetch les scores lorsque le mode de tri change

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéLigue - Meilleurs Dresseurs</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortMode && styles.activeButton]}
          onPress={() => setSortMode(true)}
        >
          <Text style={styles.buttonText}>Débutant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, !sortMode && styles.activeButton]}
          onPress={() => setSortMode(false)}
        >
          <Text style={styles.buttonText}>Champion</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Image source={item.profileImage ? { uri: item.profileImage } : require('../assets/default-profile.png')} style={styles.profileImage} />
            <View style={styles.scoreDetails}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              {sortMode ? 
              <Text style={styles.scores}>Best score: {item.bestScore}</Text>
              :
              <Text style={styles.scores}>Best score: {item.bestChampionScore}</Text>
              }
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sortButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rank: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 10,
    width: 30,
    textAlign: 'center',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: '50%',
    marginRight: 15,
  },
  scoreDetails: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scores: {
    fontSize: 16,
  },
});

export default PokeLigue;
