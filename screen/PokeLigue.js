import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { firestore } from '../config/firebaseConfig'; // Assurez-vous que ce chemin est correct

const PokeLigue = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const usersCollection = firestore.collection('users');
//         const snapshot = await usersCollection.get();
//         const usersScores = snapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             nickname: data.nickname || 'No Nickname',
//             bestScore: data.bestScore || 0,
//             bestChampionScore: data.bestChampionScore || 0,
//           };
//         });
//         setScores(usersScores);
//       } catch (error) {
//         console.error('Error fetching scores:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScores();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéLigue - Meilleurs Scores</Text>
      {/* <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.nickname}>{item.nickname}</Text>
            <Text style={styles.scores}>Best Débutant: {item.bestScore}</Text>
            <Text style={styles.scores}>Best Champion: {item.bestChampionScore}</Text>
          </View>
        )}
      /> */}
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
  scoreItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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