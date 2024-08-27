import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { auth, firestore, storage } from '../config/firebaseConfig'; 
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import bgImageHeader from '../assets/bg-profile-header.jpg'

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [bestChampionScore, setBestChampionScore] = useState(0);
  const [inputNickname, setInputNickname] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
          } else {
            console.log('No such document!');
          }
          setLoading(false); // Assurez-vous que le loader est caché après la lecture
        }, (error) => {
          console.error("Error getting document:", error);
          setLoading(false); // Assurez-vous que le loader est caché en cas d'erreur
        });
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
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

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error signing out:', error);
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
      await handleSaveProfileImage(); // Sauvegarder la nouvelle image de profil
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

          {inputNickname ? <Text>Choose your nickname</Text> : null }
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
                Welcome {nickname}!
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
              <View style={{flexDirection:'column',width:'50%'}}>
                <Text style={{textAlign:'center'}}>Best Débutant:</Text>
                <Text style={{textAlign:'center',fontSize:32,fontWeight:'bold'}}>{bestScore}</Text>
              </View>
              <View style={{flexDirection:'column',width:'50%'}}>
                <Text style={{textAlign:'center'}}>Best Champion:</Text>
                <Text style={{textAlign:'center',fontSize:32,fontWeight:'bold'}}>{bestChampionScore}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

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
  header: {
    alignItems: 'center',
  },
  bgImage: {
    width:'100%',
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    borderWidth:2,
    borderColor: '#f2f2f2',
    position:'relative',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  editIcon: {
    position:'absolute',
    bottom:20,
    right:'30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
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
  modifyNickname:{
    paddingLeft:10
  },
  input: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    width: '65%',
    paddingHorizontal:8,
    marginRight:4,
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
  bestScoreSection:{
    alignItems:'center',
    marginVertical:15,
    width:'100%'
  },
  bestScoreSectionTitle: {
    fontWeight:'bold',
    fontSize:18,
    marginBottom:10,
  },
  bestScore: {
    marginVertical:5,
    flexDirection:'row',
    justifyContent:'space-around',
  },
  footer: {
    alignItems: 'center',
  },
  signOutButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  signOutButtonText: {
    color: '#FF0000',
    fontWeight:'bold',
    fontSize: 16,
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
    borderRadius:10,
    resizeMode: 'contain',
  },
});

export default Profile;