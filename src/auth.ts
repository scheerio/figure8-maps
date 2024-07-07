// firebase/auth.ts
import { auth } from './firebase'; // Ensure 'auth' is correctly exported from firebaseConfig.ts
import { signInWithEmailAndPassword as signIn, signOut as signOutUser, createUserWithEmailAndPassword as signUp } from 'firebase/auth';

const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signIn(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

const signOut = async () => {
  try {
    await signOutUser(auth);
  } catch (error) {
    throw error;
  }
};

const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signUp(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword };
