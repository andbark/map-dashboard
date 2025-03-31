import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);
export const db = getFirestore(app);

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics }; 