import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, query, limit } from 'firebase/firestore';

export async function testFirebaseConnection() {
  const testCollection = collection(db, '_test_connection');
  const testData = { timestamp: new Date().toISOString() };
  
  try {
    // Try to write a document
    const docRef = await addDoc(testCollection, testData);
    console.log('Test write successful');
    
    // Try to read the document
    const q = query(testCollection, limit(1));
    const querySnapshot = await getDocs(q);
    console.log('Test read successful');
    
    // Clean up the test document
    await deleteDoc(docRef);
    console.log('Test cleanup successful');
    
    return { success: true, message: 'Firebase connection test passed' };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { 
      success: false, 
      message: 'Firebase connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 