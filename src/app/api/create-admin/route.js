import { NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../utils/firebase';

export async function POST() {
  try {
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