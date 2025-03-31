import { NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../lib/firebase';

export async function POST() {
  try {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@mapdashboard.com',
      'admin123456'
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      uid: userCredential.user.uid 
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 