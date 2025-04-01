import { collection, addDoc, getDocs, query, where, orderBy, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';

// Save schools to Firestore with improved error handling
export async function saveSchools(schools) {
  if (!firestore) {
    console.error("Firestore instance is not available.");
    return { success: false, error: 'Firestore not initialized' };
  }
  if (!Array.isArray(schools) || schools.length === 0) {
    console.log('No schools data provided to save.');
    return { success: false, error: 'No school data provided' };
  }
  
  console.log(`Starting batch save of ${schools.length} schools to Firestore`);
  const schoolsCollectionRef = collection(firestore, 'schools');
  const batch = writeBatch(firestore);
  let schoolsAdded = 0;
  
  schools.forEach((school) => {
    if (school && school.name && school.address && school.city && school.state) {
      const newSchoolRef = doc(schoolsCollectionRef);
      batch.set(newSchoolRef, {
        name: school.name || '',
        district: school.district || '',
        address: school.address || '',
        city: school.city || '',
        state: school.state || '',
        zipCode: school.zipCode || school.zip || '',
        latitude: school.latitude !== undefined && !isNaN(parseFloat(school.latitude)) ? parseFloat(school.latitude) : null,
        longitude: school.longitude !== undefined && !isNaN(parseFloat(school.longitude)) ? parseFloat(school.longitude) : null,
      });
      schoolsAdded++;
    } else {
      console.warn('Skipping invalid school data:', school);
    }
  });

  if (schoolsAdded === 0) {
    console.log('No valid schools found to add to the batch.');
    return { success: true, totalAdded: 0, message: 'No valid schools to save.' };
  }

  try {
    console.log(`Committing batch for ${schoolsAdded} schools...`);
    await batch.commit();
    console.log(`Successfully saved ${schoolsAdded} schools to Firestore`);
    return { success: true, totalAdded: schoolsAdded };
  } catch (error) {
    console.error('Error saving schools batch to Firestore:', error);
    return { success: false, error: error.message };
  }
}

// Get all schools from Firestore
export async function getAllSchools() {
  if (!firestore) { 
    console.error("Firestore instance is not available.");
    return { success: false, error: 'Firestore not initialized' };
  }
  try {
    const schoolsCollectionRef = collection(firestore, 'schools');
    const q = query(schoolsCollectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const schools = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return { success: true, schools };
  } catch (error) {
    console.error('Error fetching schools from Firestore:', error);
    return { success: false, error: error.message };
  }
}

// Delete all schools from Firestore
export async function deleteAllSchools() {
  if (!firestore) { 
    console.error("Firestore instance is not available.");
    return { success: false, error: 'Firestore not initialized' };
  }
  console.log("Attempting to delete all schools from Firestore...");
  const schoolsCollectionRef = collection(firestore, 'schools');
  let deletedCount = 0;
  
  try {
    const snapshot = await getDocs(schoolsCollectionRef); 
    if (snapshot.empty) {
      console.log("No schools found to delete.");
      return { success: true, deletedCount: 0 };
    }
    
    const BATCH_SIZE = 400;
    let batch = writeBatch(firestore);
    let batchCount = 0;

    for (const docSnapshot of snapshot.docs) {
      batch.delete(docSnapshot.ref);
      batchCount++;
      deletedCount++;
      if (batchCount === BATCH_SIZE) {
        console.log(`Committing delete batch of ${batchCount} schools...`);
        await batch.commit();
        batch = writeBatch(firestore);
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      console.log(`Committing final delete batch of ${batchCount} schools...`);
      await batch.commit();
    }
    
    console.log(`Successfully deleted ${deletedCount} schools.`);
    return { success: true, deletedCount };

  } catch (error) {
    console.error('Error deleting all schools:', error);
    return { success: false, error: error.message };
  }
}

// Function to save file metadata (if used by fileUpload.js)
export async function saveFileMetadata(metadata) {
  if (!firestore) { 
    console.error("Firestore instance is not available for saveFileMetadata.");
    return { success: false, error: 'Firestore not initialized' };
  }
  try {
    const filesCollectionRef = collection(firestore, 'uploadedFiles');
    const docRef = await addDoc(filesCollectionRef, {
      ...metadata,
      uploadedAt: serverTimestamp()
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
    const filesRef = collection(firestore, 'files');
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
    const filesRef = collection(firestore, 'files');
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