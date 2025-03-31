import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// Save file metadata to Firestore
export async function saveFileMetadata(fileData) {
  try {
    const docRef = await addDoc(collection(db, 'files'), {
      filename: fileData.filename,
      url: fileData.url,
      type: fileData.type,
      size: fileData.size,
      uploadedBy: fileData.uploadedBy || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving file metadata:', error);
    return { success: false, error: error.message };
  }
}

// Get all files
export async function getAllFiles() {
  try {
    const filesRef = collection(db, 'files');
    const q = query(filesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, files };
  } catch (error) {
    console.error('Error getting files:', error);
    return { success: false, error: error.message };
  }
}

// Get files by type
export async function getFilesByType(fileType) {
  try {
    const filesRef = collection(db, 'files');
    const q = query(
      filesRef,
      where('type', '==', fileType),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, files };
  } catch (error) {
    console.error('Error getting files by type:', error);
    return { success: false, error: error.message };
  }
} 