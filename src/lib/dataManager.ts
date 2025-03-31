import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

// Interface for our data structure
interface MapData {
  id?: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Add other fields as needed
  createdAt: Date;
}

// Function to import data
export const importData = async (data: MapData[]) => {
  try {
    const collectionRef = collection(db, 'mapData');
    const promises = data.map(item => addDoc(collectionRef, {
      ...item,
      createdAt: new Date()
    }));
    await Promise.all(promises);
    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, message: 'Failed to import data' };
  }
};

// Function to fetch all data
export const fetchAllData = async () => {
  try {
    const collectionRef = collection(db, 'mapData');
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, message: 'Failed to fetch data' };
  }
};

// Function to delete specific data
export const deleteData = async (id: string) => {
  try {
    const docRef = doc(db, 'mapData', id);
    await deleteDoc(docRef);
    return { success: true, message: 'Data deleted successfully' };
  } catch (error) {
    console.error('Error deleting data:', error);
    return { success: false, message: 'Failed to delete data' };
  }
};

// Function to delete all data
export const deleteAllData = async () => {
  try {
    const collectionRef = collection(db, 'mapData');
    const querySnapshot = await getDocs(collectionRef);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return { success: true, message: 'All data deleted successfully' };
  } catch (error) {
    console.error('Error deleting all data:', error);
    return { success: false, message: 'Failed to delete all data' };
  }
}; 