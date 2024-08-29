import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Image, Modal, Pressable, FlatList } from 'react-native';
import { auth, firestore, storage } from '../config/firebaseConfig';
import { handleSignOut } from '../utils/authUtils'; 
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import bgImageHeader from '../assets/bg-profile-header.jpg';
import axios from 'axios';

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfileImage, setLoadingProfileImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [inputNickname, setInputNickname] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [bestChampionScore, setBestChampionScore] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState(null);
  const [modalPokemonVisible, setModalPokemonVisible] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [isUpdatingPokemon, setIsUpdatingPokemon] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = firestore.collection('users').doc(user.uid);
        const unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setProfileImage(data.profileImage || null);
            setNickname(data.nickname || '');
            setBestScore(data.bestScore || 0);
            setBestChampionScore(data.bestChampionScore || 0);
            setFavoritePokemon(data.favoritePokemon || null);
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
        setUser(null);
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Récuperer la liste des Pokemons avec axios
  useEffect(() => {
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

  // Change profile image
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`profileImages/${user.uid}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  };
  const handleChangeProfileImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });
  
      if (!result.canceled) {
        setLoadingProfileImage(true); // Commencez par activer l'indicateur de chargement
        const profileImageUrl = await uploadImage(result.assets[0].uri); // Téléchargez l'image sur Firebase Storage
  
        await firestore.collection('users').doc(user.uid).set({
          profileImage: profileImageUrl
        }, { merge: true });
  
        setProfileImage(profileImageUrl); // Mettez à jour l'état local avec l'URL de l'image téléchargée
        setLoadingProfileImage(false); // Désactivez l'indicateur de chargement
        alert('Profile image updated!');
      }
    } catch (error) {
      setLoadingProfileImage(false);
      console.error('Error updating profile image:', error);
      alert('There was an error updating your profile image. Please try again.');
    }
  };

  // Change nickname
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
  const handleEditNickname = () => {
    setInputNickname(true);
  };

  // Change favorite pokemon  
  const updateUserData = async (userId, data) => {
    try {
      await firestore.collection('users').doc(userId).set(data, { merge: true });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };  
  const handleSelectPokemon = async (pokemon) => {
    if (!pokemon || !pokemon.name || !pokemon.image) {
      console.error('Invalid Pokémon data');
      return;
    }
  
    try {
      setIsUpdatingPokemon(true); // Activer le loader
  
      const selectedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
      };
  
      // Mise à jour de l'état local
      setFavoritePokemon(selectedPokemon);
      setSelectedPokemonId(pokemon.id);
  
      setModalPokemonVisible(false);
      // Mise à jour Firestore
      await updateUserData(user.uid, { favoritePokemon: selectedPokemon });
  
      setIsUpdatingPokemon(false);
  
      alert('Your favorite pokemon has been updated!');
    } catch (error) {
      console.error('Error selecting Pokémon:', error);
      setIsUpdatingPokemon(false);
    }
  };

  // Loader
  if (loading) {
    return <ActivityIndicator size="large" color="#878787" />;
  }

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <ImageBackground source={bgImageHeader} style={styles.bgImage}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.profileImageWrapper}>
                <Image
                  source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
                  style={styles.profileImage}
                />
                {loadingProfileImage && (
                  <ActivityIndicator size="small" color="#ffffff" style={styles.activityIndicator} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChangeProfileImage} style={styles.editIcon}>
              <Icon name="pencil" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Header Modal pour afficher l'image en grand */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
            style={styles.modalImage}
          />
        </Pressable>
      </Modal>

        {/* Main content  */}
      <View style={styles.container}>
        {/* Nickname */}
        <View style={styles.labelInput}>
          {nickname === '' & !inputNickname ? 
            <TouchableOpacity onPress={handleEditNickname}>
              <Text>Choose a nickname</Text>
            </TouchableOpacity> 
            : null
          }
          {inputNickname ? 
            <Text>Choose a nickname</Text> 
            : null
          }
        </View>
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
              <>
                <Text style={styles.welcomeText}>
                  Welcome <Text style={styles.nickname}>{nickname}</Text> !
                </Text>
                {nickname === '' ? null :
                  <TouchableOpacity onPress={handleEditNickname} style={styles.iconButton}>
                    <Icon name="pencil" size={14} color="#000" />
                  </TouchableOpacity>
                }
              </>
            )}
        </View>

        {/*  Bestscore */}
        <View style={styles.bestScoreSection}>
            <Text style={styles.bestScoreSectionTitle}>your personal best score</Text>
            <View style={styles.bestScore}>
              <View style={styles.bestScoreMode}>
                <Text>Best Débutant:</Text>
                <Text style={styles.bestScoreText}>{bestScore}</Text>
              </View>
              <View style={styles.bestScoreMode}>
                <Text>Best Champion:</Text>
                <Text style={styles.bestScoreText}>{bestChampionScore}</Text>
              </View>
            </View>
        </View>
        
        {/*  Favorite Pokemon */}
        <View style={styles.favoritePokemonSection}>
          <Text style={styles.favoritePokemonText}>
            your favorite Pokémon is <Text style={{ color: 'red' }}> {favoritePokemon?.name}</Text>
          </Text>
          {favoritePokemon ? (
            <View style={styles.favoritePokemonContainer}>
              {isUpdatingPokemon ? (
                <ActivityIndicator size="small" color="#a9a9a9" style={styles.pokemonLoader} />
              ) : (
                <Image
                  source={{ uri: favoritePokemon.image }}
                  style={styles.favoritePokemonImage}
                />
              )}
              <TouchableOpacity onPress={() => setModalPokemonVisible(true)} style={styles.editFavoritePokemonIcon}>
                <Icon name="pencil" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text>No favorite Pokémon selected</Text>
              <TouchableOpacity onPress={() => setModalPokemonVisible(true)} style={styles.editIcon}>
                <Icon name="pencil" size={15} color="#000" />
              </TouchableOpacity>
            </View>
          )}
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

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleSignOut(navigation)} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    profileImageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#f2f2f2',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  activityIndicator: {
    position: 'absolute',
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
  container: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical:8,
  },
  nicknameContainer: {
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center',
  },
  welcomeText: {
    position:'relative',
    fontSize: 24,
    marginHorizontal:10,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: 20,
    color: 'red',
    fontFamily: 'pokemon-classic',
    letterSpacing: 1.1,
  },
  iconButton: {
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  labelInput: {
    alignItems:'center',
    marginVertical:6
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
    paddingHorizontal: 10,
    justifyContent:'center',
    height: 35,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight:'500',
    fontSize: 16,
  },
  bestScoreSection: {
    backgroundColor:'#F3F6F7',
    borderColor:'#ececec',
    borderWidth:1,
    alignItems: 'center',
    marginTop:20,
    marginVertical: 10,
    padding:10,
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bestScoreSectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 5,
    fontFamily:'pokemon-classic',
  },
  bestScore: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bestScoreMode: {
    flexDirection: 'column',
    width: '50%',
    justifyContent:'center',
    alignItems:'center'
  },
  bestScoreText: {
    fontWeight:'bold',
    fontSize:35,
  },
  favoritePokemonSection: {
    backgroundColor:'#F3F6F7',
    borderColor:'#ececec',
    borderWidth:1,
    alignItems: 'center',
    marginVertical: 10,
    paddingBottom:8,
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  favoritePokemonText: {
    marginVertical: 10,
    fontFamily:'pokemon-classic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  pokemonLoader: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritePokemonContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  favoritePokemonImage: {
    width: 120,
    height: 120,
    shadowColor: "#FFE894",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.75,
    shadowRadius: 8,
  },
  editFavoritePokemonIcon: {
    position: 'absolute',
    top: 5,
    right: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
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
});

export default Profile;
