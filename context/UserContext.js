import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, firestore } from '../config/firebaseConfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    profileImage: null,
    nickname: '',
    bestScore: 0,
    bestChampionScore: 0,
    favoritePokemon: null,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          console.log('uid',authUser.uid);
          const userDoc = await firestore.collection('users').doc(authUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUser({ ...authUser, ...userData });
            setProfileData(userData); // Mettez à jour profileData avec les données récupérées
          } else {
            console.log('No user data found for:', authUser.uid);
            setUser(authUser); // Utilisateur connecté sans données supplémentaires
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
          console.log('User connected:', authUser);
          setUser(authUser); // Utilisateur connecté sans données supplémentaires
        }
      } else {
        console.log('User not connected');
        setUser(null);
        setProfileData({
          id: '',
          profileImage: null,
          nickname: '',
          bestScore: 0,
          bestChampionScore: 0,
          favoritePokemon: null,
        }); // Réinitialisez profileData lorsque l'utilisateur se déconnecte
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profileData, setProfileData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);