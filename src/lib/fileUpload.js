import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { saveFileMetadata } from './database';

export async function uploadFile(file) {
  try {
    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `uploads/${filename}`);
    
    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save file metadata to Firestore
    const fileData = {
      filename: filename,
      url: downloadURL,
      type: file.type,
      size: file.size,
      uploadedBy: 'anonymous' // You can replace this with actual user info if you have authentication
    };
    
    const dbResult = await saveFileMetadata(fileData);
    
    if (!dbResult.success) {
      throw new Error('Failed to save file metadata');
    }
    
    return {
      success: true,
      url: downloadURL,
      filename: filename,
      id: dbResult.id
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 