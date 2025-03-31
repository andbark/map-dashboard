// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqeov7UixuS6Zo0vXbb_WmP5BbRoWSYcs",
  authDomain: "map-dashboard-5bdce.firebaseapp.com",
  projectId: "map-dashboard-5bdce",
  storageBucket: "map-dashboard-5bdce.firebasestorage.app",
  messagingSenderId: "368958593163",
  appId: "1:368958593163:web:0c146444e79646f34a5c8e",
  measurementId: "G-DT81BVFCYL"
};

// Initialize Firebase
let app;
let firestore;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  auth = getAuth(app);
  
  // Enable offline persistence
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(firestore)
      .then(() => {
        console.log('Firebase initialized successfully');
      })
      .catch((err) => {
        console.error('Firebase persistence error:', err.code);
      });
  }
} else {
  app = getApps()[0];
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { app, firestore, auth }; 