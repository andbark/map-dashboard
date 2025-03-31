import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();

// Function to create admin user
export async function createAdminUser() {
  try {
    const userRecord = await adminAuth.createUser({
      email: 'admin@mapdashboard.com',
      password: 'admin',
      emailVerified: true,
    });
    console.log('Successfully created admin user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
} 