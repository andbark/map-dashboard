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

// Initialize Firebase App and Services using a Singleton pattern
let app;
let firestore;
let auth;
let storage;

if (getApps().length === 0) {
  // Initialize the default app only if it doesn't exist
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully (new instance).');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Handle initialization error appropriately
    // Depending on the error, you might want to throw it or log it differently
  }
} else {
  // Get the default app if it already exists
  app = getApp();
  console.log('Firebase app already initialized, getting existing instance.');
}

// Get Firestore, Auth, Storage instances (safe to call multiple times)
try {
  firestore = getFirestore(app);
} catch(e) { console.error("Error getting Firestore instance:", e); }

try {
  auth = getAuth(app);
} catch(e) { console.error("Error getting Auth instance:", e); }

try {
  storage = getStorage(app);
} catch(e) { console.error("Error getting Storage instance:", e); }

// Removed IndexedDB persistence setup temporarily to rule it out as an issue
// It can sometimes cause complexity with initialization

export { app, firestore, auth, storage }; 