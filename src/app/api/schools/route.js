import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';

// GET route to fetch all schools
export async function GET(request) {
  if (!firestore) {
    return new Response(JSON.stringify({ error: 'Firestore not initialized' }), { status: 500 });
  }
  try {
    const schoolsCollectionRef = collection(firestore, 'schools');
    const snapshot = await getDocs(schoolsCollectionRef);
    const schools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(schools), { status: 200 });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch schools' }), { status: 500 });
  }
}

// POST route to add schools
export async function POST(request) {
  if (!firestore) {
    return new Response(JSON.stringify({ error: 'Firestore not initialized' }), { status: 500 });
  }
  try {
    const schools = await request.json();
    if (!Array.isArray(schools) || schools.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid input: Expected an array of schools' }), { status: 400 });
    }

    const schoolsCollectionRef = collection(firestore, 'schools');
    const batch = writeBatch(firestore);
    let count = 0;

    schools.forEach(school => {
      if (school && school.name) {
        const newDocRef = doc(schoolsCollectionRef);
        batch.set(newDocRef, school);
        count++;
      } else {
        console.warn("Skipping invalid school data in POST request:", school);
      }
    });

    if (count === 0) {
      return new Response(JSON.stringify({ error: 'No valid schools provided to add' }), { status: 400 });
    }

    await batch.commit();
    return new Response(JSON.stringify({ success: true, message: `Added ${count} schools` }), { status: 201 });
  } catch (error) {
    console.error("Error adding schools:", error);
    return new Response(JSON.stringify({ error: 'Failed to add schools' }), { status: 500 });
  }
}

// DELETE route to delete all schools (admin only)
export async function DELETE(request) {
  if (!firestore) {
    return new Response(JSON.stringify({ error: 'Firestore not initialized' }), { status: 500 });
  }
  
  console.log("API attempting to delete all schools...");
  const schoolsCollectionRef = collection(firestore, 'schools');
  let deletedCount = 0;

  try {
    const snapshot = await getDocs(schoolsCollectionRef);
    if (snapshot.empty) {
      return new Response(JSON.stringify({ success: true, message: 'No schools to delete' }), { status: 200 });
    }

    const BATCH_SIZE = 400; 
    let batch = writeBatch(firestore);
    let batchCount = 0;

    for (const docSnapshot of snapshot.docs) {
      batch.delete(docSnapshot.ref);
      batchCount++;
      deletedCount++;
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batch = writeBatch(firestore);
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`API successfully deleted ${deletedCount} schools.`);
    return new Response(JSON.stringify({ success: true, deletedCount }), { status: 200 });
  } catch (error) {
    console.error("Error deleting all schools via API:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete schools' }), { status: 500 });
  }
} 