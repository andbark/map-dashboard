import { firestore } from '../utils/firebase';
import { collection, addDoc, getDocs, deleteDoc, query, limit, doc } from 'firebase/firestore';

// Test function to verify Firestore connection and basic operations
export async function testFirebaseConnection() {
  if (!firestore) {
    const errorMsg = "Firestore instance is not available for testFirebaseConnection.";
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  const testCollectionName = 'firebase_test_connection';
  const testCollectionRef = collection(firestore, testCollectionName);
  const testData = { message: 'Firebase connection test', timestamp: new Date() };
  let docRefId: string | null = null;

  try {
    // 1. Test Write
    console.log(`Testing write to collection: ${testCollectionName}`);
    const docRef = await addDoc(testCollectionRef, testData);
    docRefId = docRef.id;
    console.log(`Write successful. Document ID: ${docRefId}`);

    // 2. Test Read (limit to 1 to be efficient)
    console.log(`Testing read from collection: ${testCollectionName}`);
    const q = query(testCollectionRef, limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('Read test failed: No documents found after writing.');
    }
    console.log(`Read successful. Found ${querySnapshot.size} document(s).`);
    querySnapshot.forEach(doc => console.log('Sample read data:', doc.data()));

    // 3. Test Delete (Ensure docRefId is a string before calling deleteDoc)
    console.log(`Testing delete for document ID: ${docRefId}`);
    if (typeof docRefId === 'string') {
      await deleteDoc(doc(firestore, testCollectionName, docRefId));
      console.log('Delete successful.');
    } else {
      console.warn('Skipping delete test as Document ID was not obtained.');
    }

    return { 
      success: true, 
      message: 'Firestore connection and basic operations successful.' 
    };

  } catch (error) {
    console.error('Firebase connection test failed:', error);
    // Attempt cleanup if write succeeded but subsequent steps failed
    if (typeof docRefId === 'string') {
      try {
        console.log(`Attempting cleanup: Deleting test document ${docRefId}`);
        await deleteDoc(doc(firestore, testCollectionName, docRefId));
        console.log('Cleanup delete successful.');
      } catch (cleanupError) {
        console.error('Cleanup delete failed:', cleanupError);
      }
    }
    return { 
      success: false, 
      error: `Firebase test failed: ${error.message}`
    };
  }
} 

// The default export was likely incorrect for a utility file
// Removing it unless specifically needed as an API route
// export default async function handler(req, res) {
//   // ... rest of the handler ...
// } 