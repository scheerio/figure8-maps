import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const handleGoogleSignIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};
