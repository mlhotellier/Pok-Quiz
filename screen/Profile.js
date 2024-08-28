import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Image, Modal, Pressable, FlatList } from 'react-native';
import { auth, firestore, storage } from '../config/firebaseConfig'; 
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import bgImageHeader from '../assets/bg-profile-header.jpg';
import { handleSignOut } from '../utils/authUtils';
import axios from 'axios';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [bestChampionScore, setBestChampionScore] = useState(0);
  const [inputNickname, setInputNickname] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState(null);
  const [modalPokemonVisible, setModalPokemonVisible] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null); // Ajouté pour suivre le Pokémon sélectionné

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = firestore.collection('users').doc(user.uid);
        const unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setNickname(data.nickname || '');
            setBestScore(data.bestScore || 0);
            setBestChampionScore(data.bestChampionScore || 0);
            setProfileImage(data.profileImage || null);
            setFavoritePokemon(data.favoritePokemon || null);
            setSelectedPokemonId(data.favoritePokemon?.id || null); // Met à jour le Pokémon sélectionné
          } else {
            console.log('No such document!');
          }
          setLoading(false);
        }, (error) => {
          console.error("Error getting document:", error);
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch Pokémon data once when the component is mounted
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
        setPokemonList(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonList();
  }, []);

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`profileImages/${user.uid}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  };

  const handleSaveNickname = async () => {
    if (nickname.trim() === '') {
      alert('Nickname cannot be empty.');
      return;
    }
    if (user) {
      await firestore.collection('users').doc(user.uid).set({
        nickname
      }, { merge: true });
      alert('Nickname updated!');
      setInputNickname(false);
    }
  };

  const handleSaveProfileImage = async () => {
    if (profileImage && !profileImage.startsWith('http')) {
      const profileImageUrl = await uploadImage(profileImage);
      await firestore.collection('users').doc(user.uid).set({
        profileImage: profileImageUrl
      }, { merge: true });
      alert('Profile image updated!');
    }
  };

  const handleEditNickname = () => {
    setInputNickname(true);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await handleSaveProfileImage();
    }
  };

  const handleSelectPokemon = async (pokemon) => {
    try {
      const selectedPokemon = {
        id: pokemon.id, // Assurez-vous d'inclure l'ID
        name: pokemon.name,
        image: pokemon.image, // Utilise l'URL de l'image
      };
  
      setFavoritePokemon(selectedPokemon);
      setSelectedPokemonId(selectedPokemon.id); // Met à jour l'ID du Pokémon sélectionné
  
      await firestore.collection('users').doc(user.uid).set({
        favoritePokemon: selectedPokemon
      }, { merge: true });
  
      setModalPokemonVisible(false);
    } catch (error) {
      console.error('Error selecting Pokémon:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <View style={styles.header}>
        <ImageBackground source={bgImageHeader} style={styles.bgImage}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <Icon name="pencil" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.container}>
        <View style={styles.main}>
          {nickname === '' ? 
            <TouchableOpacity onPress={handleEditNickname}>
              <Text>Choose a nickname</Text>
            </TouchableOpacity> 
            : null
          }

          {inputNickname ? <Text>Choose your nickname</Text> : null}
          <View style={styles.nicknameContainer}>
            {inputNickname ? (
              <>
                <TextInput
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChangeText={setNickname}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleSaveNickname} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.welcomeText}>
                Welcome <Text style={{ fontSize: 19, color: 'red', fontFamily: 'pokemon-solid', letterSpacing: 1.2 }}>{nickname}</Text> !
                {nickname === '' ? null : 
                  <View style={styles.modifyNickname}>
                    <TouchableOpacity onPress={handleEditNickname} style={styles.iconButton}>
                      <Icon name="pencil" size={14} color="#000" />
                    </TouchableOpacity>
                  </View>
                }
              </Text>
            )}
          </View>
          <Text style={styles.emailText}>Email: {user?.email}</Text>
          <View style={styles.bestScoreSection}>
            <Text style={styles.bestScoreSectionTitle}>Your personal best score</Text>
            <View style={styles.bestScore}>
              <View style={{ flexDirection: 'column', width: '50%' }}>
                <Text style={{ textAlign: 'center' }}>Best Débutant:</Text>
                <Text style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>{bestScore}</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '50%' }}>
                <Text style={{ textAlign: 'center' }}>Best Champion:</Text>
                <Text style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>{bestChampionScore}</Text>
              </View>
            </View>
          </View>
          <View style={styles.favoritePokemonSection}>
            <Text style={styles.favoritePokemonText}>Favorite Pokémon:</Text>
            {favoritePokemon ? (
              <View style={styles.favoritePokemonContainer}>
                <Image
                  source={{ uri: favoritePokemon.image }}
                  style={styles.favoritePokemonImage}
                />
                <TouchableOpacity onPress={() => setModalPokemonVisible(true)} style={styles.editFavoritePokemonIcon}>
                  <Icon name="pencil" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection:'row'}}>
                <Text>No favorite Pokémon selected</Text>
                <TouchableOpacity onPress={() => setModalPokemonVisible(true)} style={{position:'relative',top:-5,right:-5,backgroundColor: 'white',borderRadius: 20,padding: 5,borderWidth: 1,borderColor: 'grey',}}>
                  <Icon name="pencil" size={15} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Modal pour choisir un Pokémon favori */}
        <Modal
          visible={modalPokemonVisible}
          onRequestClose={() => setModalPokemonVisible(false)}
          transparent={true}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalPokemonVisible(false)}>
            <View style={styles.modalContainer}>
              <Pressable style={styles.closeButton} onPress={() => setModalPokemonVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <FlatList
                data={pokemonList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleSelectPokemon(item)} 
                    style={styles.pokemonItem}
                  >
                    <Text style={[
                      styles.pokemonName, 
                      item.id === selectedPokemonId ? styles.selectedPokemonName : {}
                    ]}>
                      #{item.id} : {item.slug}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        {/* Modal pour afficher l'image en grand */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
              style={styles.modalImage}
            />
          </Pressable>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Styles pour le header
  header: {
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    borderWidth: 2,
    borderColor: '#f2f2f2',
    position: 'relative',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  editIcon: {
    position: 'absolute',
    bottom: 20,
    right: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },

  // Styles pour le conteneur principal
  container: {
    justifyContent: 'center',
    padding: 16,
  },
  main: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  iconButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 2,
  },
  modifyNickname: {
    paddingLeft: 10,
  },
  input: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    width: '65%',
    paddingHorizontal: 8,
    marginRight: 4,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bestScoreSection: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  bestScoreSectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  bestScore: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButton: {
    padding: 10,
    marginTop: 10,
  },
  signOutButtonText: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Styles pour les modals
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent pour l'arrière-plan
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pokemonItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#ddd',
  },
  pokemonName: {
    fontSize: 18,
  },
  selectedPokemonName: {
    fontWeight: 'bold',
    color: 'red',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  favoritePokemonSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  favoritePokemonText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  favoritePokemonContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  favoritePokemonImage: {
    width: 120,
    height: 120,
  },
  editFavoritePokemonIcon: {
    position: 'absolute',
    top: 0,
    right: -25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  choosePokemonButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  choosePokemonButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;