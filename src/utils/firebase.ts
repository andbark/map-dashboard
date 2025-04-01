// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ6tsj3CgZEZ4tdbSJWs3T7aaDL5bqJD0",
  authDomain: "school-map-dashboard.firebaseapp.com",
  projectId: "school-map-dashboard",
  storageBucket: "school-map-dashboard.firebasestorage.app",
  messagingSenderId: "984466160536",
  appId: "1:984466160536:web:aa1def24dce50a9bcb89ed"
};

let app;
let firestore;
let auth;
let storage;

// === STEP 2: RE-ENABLING INITIALIZATION ===
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
  }
} else {
  // Get the default app if it already exists
  app = getApp();
  // Get services using the existing app instance
  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log('Firebase app already initialized, getting existing instance.');
}
// === END RE-ENABLING ===

// Export the initialized services (or potentially undefined if initialization failed)
export { app, firestore, auth, storage }; 