import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';

// GET route to fetch all schools
export async function GET() {
  try {
    const schoolsRef = collection(db, 'schools');
    const querySnapshot = await getDocs(schoolsRef);
    
    const schools = [];
    querySnapshot.forEach((doc) => {
      schools.push({ id: doc.id, ...doc.data() });
    });
    
    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST route to add schools
export async function POST(request) {
  try {
    const body = await request.json();
    const schoolsRef = collection(db, 'schools');
    
    // Handle single school or array of schools
    if (Array.isArray(body.schools)) {
      // Bulk create schools using a batch write
      const batch = writeBatch(db);
      const createdSchools = [];
      
      for (const school of body.schools) {
        const docRef = doc(schoolsRef);
        batch.set(docRef, {
          name: school.name,
          address: school.address,
          city: school.city,
          state: school.state,
          zip: school.zip,
          district: school.district || null,
          latitude: school.latitude || null,
          longitude: school.longitude || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        createdSchools.push({ id: docRef.id, ...school });
      }
      
      await batch.commit();
      return NextResponse.json({ schools: createdSchools }, { status: 201 });
    } else {
      // Create a single school
      const docRef = await addDoc(schoolsRef, {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        district: body.district || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        school: { id: docRef.id, ...body } 
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating school(s):', error);
    return NextResponse.json(
      { error: 'Failed to create school(s)' },
      { status: 500 }
    );
  }
}

// DELETE route to delete all schools (admin only)
export async function DELETE() {
  try {
    // In a real app, you would check for admin authorization here
    
    // Delete all schools using a batch write
    const schoolsRef = collection(db, 'schools');
    const querySnapshot = await getDocs(schoolsRef);
    const batch = writeBatch(db);
    
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    return NextResponse.json({ message: 'All schools deleted successfully' });
  } catch (error) {
    console.error('Error deleting schools:', error);
    return NextResponse.json(
      { error: 'Failed to delete schools' },
      { status: 500 }
    );
  }
} 