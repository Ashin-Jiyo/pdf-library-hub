import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Guest Firebase project configuration
const guestFirebaseConfig = {
  apiKey: "AIzaSyBDcRabMU_tmv8dx2BihfGTcAlkRKGS-6k",
  authDomain: "guestpdf-13013.firebaseapp.com",
  projectId: "guestpdf-13013",
  storageBucket: "guestpdf-13013.firebasestorage.app",
  messagingSenderId: "489548538163",
  appId: "1:489548538163:web:52976b71ab1e1125c65e46",
  measurementId: "G-MCMEWG56VX"
};

// Initialize Guest Firebase App with a unique name
const guestApp = initializeApp(guestFirebaseConfig, 'guest-app');

// Initialize Guest Firebase services
export const guestAuth = getAuth(guestApp);
export const guestDb = getFirestore(guestApp);
export const guestStorage = getStorage(guestApp);

// Initialize Analytics for guest app
export const guestAnalytics = typeof window !== 'undefined' && guestFirebaseConfig.measurementId 
  ? getAnalytics(guestApp) 
  : null;

export default guestApp;
