// authUtils.js
import { auth } from '../config/firebaseConfig';

export const handleSignOut = async (navigation) => {
  try {
    await auth.signOut();
    console.log('User signed out');
    if (navigation) {
      navigation.navigate('Auth');  // Vous pouvez ajuster la navigation selon vos besoins
    } else {
      console.error('Navigation object is undefined.');
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
