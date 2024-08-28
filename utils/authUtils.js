import { auth } from '../config/firebaseConfig';

export const handleSignOut = async (navigation) => {
  try {
    await auth.signOut();
    if (navigation) {
      navigation.navigate('Auth');
    } else {
      console.error('Navigation object is undefined.');
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
};