// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

let app;
let firestore;
let auth;
let storage;

// Check if Firebase app is already initialized
if (getApps().length === 0) {
  try {
    // Initialize the default app only if it doesn't exist
    app = initializeApp(firebaseConfig);
    // Get services immediately after initializing the app
    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully (new instance).');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Handle initialization error appropriately
    // Depending on the error, you might want to throw it or log it differently
  }
} else {
  // Get the default app if it already exists
  app = getApp();
  // Get services using the existing app instance
  // These calls are safe even if called before, they return the same instance
  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log('Firebase app already initialized, getting existing instance.');
}

// Removed IndexedDB persistence setup temporarily to rule it out as an issue
// It can sometimes cause complexity with initialization

export { app, firestore, auth, storage }; 