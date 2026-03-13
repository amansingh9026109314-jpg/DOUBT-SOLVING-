// Firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz3y7O9fPUIKM6bzL-Fj2_sWAkRVWavdc",
  authDomain: "doubt-41e0f.firebaseapp.com",
  projectId: "doubt-41e0f",
  storageBucket: "doubt-41e0f.firebasestorage.app",
  messagingSenderId: "667091707349",
  appId: "1:667091707349:web:5770bd41662550e07fc95c",
  measurementId: "G-3PCR9QL6RC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database so React can use it
export const db = getFirestore(app);
export const auth = getAuth(app);