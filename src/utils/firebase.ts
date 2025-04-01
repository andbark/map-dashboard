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

let app = undefined; // Default to undefined
let firestore = undefined;
let auth = undefined;
let storage = undefined;

/* === STEP 1: TEMPORARILY COMMENTED OUT INITIALIZATION ===
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
*/

// Removed IndexedDB persistence setup temporarily to rule it out as an issue
// It can sometimes cause complexity with initialization

// Export potentially undefined services
export { app, firestore, auth, storage }; 