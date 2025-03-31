'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [status, setStatus] = useState('Loading...');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    async function testFirebaseConnection() {
      try {
        // Test reading from Firestore
        setStatus('Testing read from Firestore...');
        const schoolsCollection = collection(db, 'schools');
        const snapshot = await getDocs(schoolsCollection);
        
        // Test writing to Firestore
        setStatus('Testing write to Firestore...');
        const testCollection = collection(db, 'tests');
        const docRef = await addDoc(testCollection, {
          message: 'Test document',
          timestamp: new Date().toISOString()
        });
        
        setStatus('Success!');
        setTestResult({
          read: {
            success: true,
            schoolCount: snapshot.size
          },
          write: {
            success: true,
            documentId: docRef.id
          }
        });
      } catch (error) {
        console.error('Firebase test failed:', error);
        setStatus('Error');
        setTestResult({
          success: false,
          error: error.message
        });
      }
    }
    
    testFirebaseConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
      <div className="card p-6">
        <div className="mb-4">
          <span className="font-medium">Status: </span>
          <span className={`px-2 py-1 rounded ${
            status === 'Success!' ? 'bg-green-100 text-green-800' : 
            status === 'Error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </span>
        </div>
        
        {testResult && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 