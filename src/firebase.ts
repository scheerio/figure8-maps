import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRESTORE_API_KEY,
    authDomain: "figure8-maps.firebaseapp.com",
    projectId: "figure8-maps",
    storageBucket: "figure8-maps.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIRESTORE_SENDER_ID,
    appId: process.env.REACT_APP_FIRESTORE_APP_ID,
    measurementId: process.env.REACT_APP_FIRESTORE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, app, firebaseConfig, googleProvider, db };
