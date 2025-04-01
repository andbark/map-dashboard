import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, firestore } from '../utils/firebase';
import { saveFileMetadata } from './database';

// Upload file to Firebase Storage and save metadata to Firestore
export async function uploadFileAndSaveMetadata(
  file,
  userId
) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const storagePath = `uploads/${uniqueFilename}`;
  const storageRef = ref(storage, storagePath);

  try {
    console.log(`Uploading file to: ${storagePath}`);
    const uploadResult = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', uploadResult.metadata.fullPath);

    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('Download URL obtained:', downloadURL);

    const metadata = {
      filename: uniqueFilename,
      originalFilename: file.name,
      contentType: file.type,
      size: file.size,
      storagePath: uploadResult.metadata.fullPath,
      downloadURL: downloadURL,
      uploadedAt: serverTimestamp(),
      ...(userId ? { uploadedBy: userId } : {}),
    };

    console.log('Saving metadata to Firestore:', metadata);
    const filesCollectionRef = collection(firestore, 'uploadedFiles');
    const docRef = await addDoc(filesCollectionRef, metadata);
    console.log('Metadata saved successfully with ID:', docRef.id);

    return { ...metadata, id: docRef.id };

  } catch (error) {
    console.error('Error during file upload and metadata save:', error);
    throw new Error(`Failed to upload file or save metadata: ${error.message}`);
  }
}

export async function uploadFile(file) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `uploads/${filename}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
} 