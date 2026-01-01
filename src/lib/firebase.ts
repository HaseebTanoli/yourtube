// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
// Get these values from Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "AIzaSyAE8iixyMMt3h9Q5KHo2c5GHa0VXCs6Jnw",
  authDomain: "test-83f47.firebaseapp.com",
  projectId: "test-83f47",
  storageBucket: "test-83f47.firebasestorage.app",
  messagingSenderId: "32452395282",
  appId: "1:32452395282:web:69c3493e1cc9932f04f3cb",
};

// Initialize Firebase (avoid re-initialization)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
