import { collection, addDoc, getDocs, query, where, orderBy, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Save schools to Firestore with improved error handling
export async function saveSchools(schools) {
  try {
    console.log(`Starting batch save of ${schools.length} schools to Firestore`);
    console.log('Sample school data structure:', schools[0]);
    
    // First, delete all existing schools
    try {
      const schoolsRef = collection(db, 'schools');
      console.log('Getting existing schools from collection:', schoolsRef.path);
      const querySnapshot = await getDocs(schoolsRef);
      
      if (querySnapshot.size > 0) {
        console.log(`Deleting ${querySnapshot.size} existing schools`);
        const deleteBatch = writeBatch(db);
        
        let count = 0;
        querySnapshot.forEach((doc) => {
          deleteBatch.delete(doc.ref);
          count++;
          
          // Firestore has a limit of 500 operations per batch
          if (count >= 400) {
            console.log(`Committing delete batch with ${count} operations`);
            deleteBatch.commit();
            count = 0;
          }
        });
        
        if (count > 0) {
          console.log(`Committing final delete batch with ${count} operations`);
          await deleteBatch.commit();
        }
        
        console.log('Existing schools deleted successfully');
      } else {
        console.log('No existing schools to delete');
      }
    } catch (deleteError) {
      console.error('Error deleting existing schools:', deleteError);
      console.error('Delete error details:', JSON.stringify(deleteError, null, 2));
      // Continue with the save operation even if delete fails
    }
    
    // Then add all new schools in smaller batches to avoid timeouts
    console.log(`Adding ${schools.length} new schools`);
    const schoolsRef = collection(db, 'schools');
    const BATCH_SIZE = 100;
    let totalAdded = 0;
    
    for (let i = 0; i < schools.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const currentBatch = schools.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(schools.length/BATCH_SIZE)}: ${currentBatch.length} schools`);
      
      currentBatch.forEach((school) => {
        const docRef = doc(schoolsRef);
        // Log a sample document for debugging
        if (i === 0 && totalAdded === 0) {
          console.log('Sample document being written:', {
            name: school.name || '',
            address: school.address || '',
            city: school.city || '',
            state: school.state || '',
            zipCode: school.zipCode || school.zip || '',
            district: school.district || '',
            latitude: school.latitude !== undefined ? parseFloat(school.latitude) : null,
            longitude: school.longitude !== undefined ? parseFloat(school.longitude) : null,
          });
        }
        
        batch.set(docRef, {
          name: school.name || '',
          address: school.address || '',
          city: school.city || '',
          state: school.state || '',
          zipCode: school.zipCode || school.zip || '',
          district: school.district || '',
          latitude: school.latitude !== undefined ? parseFloat(school.latitude) : null,
          longitude: school.longitude !== undefined ? parseFloat(school.longitude) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        totalAdded++;
      });
      
      try {
        console.log(`Committing batch ${Math.floor(i/BATCH_SIZE) + 1}...`);
        const startTime = Date.now();
        await batch.commit();
        const endTime = Date.now();
        console.log(`Batch ${Math.floor(i/BATCH_SIZE) + 1} committed successfully in ${endTime - startTime}ms`);
      } catch (batchError) {
        console.error(`Error committing batch ${Math.floor(i/BATCH_SIZE) + 1}:`, batchError);
        console.error('Batch error details:', JSON.stringify(batchError, null, 2));
        throw batchError; // Re-throw to be caught by outer try/catch
      }
    }
    
    console.log(`Successfully saved ${totalAdded} schools to Firestore`);
    return { success: true, count: totalAdded };
  } catch (error) {
    console.error('Error saving schools:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }
}

// Get all schools from Firestore
export async function getAllSchools() {
  try {
    console.log('Fetching all schools from database');
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const schools = [];
    querySnapshot.forEach((doc) => {
      // Standardize property names
      const data = doc.data();
      schools.push({ 
        id: doc.id,
        name: data.name,
        district: data.district || '',
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode || data.zip || '',
        latitude: data.latitude,
        longitude: data.longitude
      });
    });
    
    console.log(`Fetched ${schools.length} schools from database`);
    return { success: true, schools };
  } catch (error) {
    console.error('Error getting schools:', error);
    return { success: false, error: error.message };
  }
}

// Delete all schools from Firestore
export async function deleteAllSchools() {
  try {
    const schoolsRef = collection(db, 'schools');
    const querySnapshot = await getDocs(schoolsRef);
    
    if (querySnapshot.size === 0) {
      return { success: true, message: "No schools to delete" };
    }
    
    const BATCH_SIZE = 400; // Firestore limit is 500
    let batchCount = 0;
    let batch = writeBatch(db);
    let count = 0;
    
    querySnapshot.forEach((document) => {
      batch.delete(document.ref);
      count++;
      
      if (count >= BATCH_SIZE) {
        batchCount++;
        console.log(`Committing delete batch ${batchCount}`);
        batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    });
    
    if (count > 0) {
      console.log(`Committing final delete batch`);
      await batch.commit();
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting schools:', error);
    return { success: false, error: error.message };
  }
}

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