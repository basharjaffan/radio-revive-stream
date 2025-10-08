import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA4pH68vclHIU2ahMfRZguixmvP7bvmTas",
  authDomain: "bashify-f7441.firebaseapp.com",
  projectId: "bashify-f7441",
  storageBucket: "bashify-f7441.firebasestorage.app",
  messagingSenderId: "4459444493",
  appId: "1:4459444493:web:654d7e780d94cb6b395844"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
