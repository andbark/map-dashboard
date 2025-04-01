'use client';

import { useState, useEffect } from 'react';
import { firestore } from '../utils/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [status, setStatus] = useState('Idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setError(null);
    setData(null);

    if (!firestore) {
      setStatus('Error');
      setError('Firestore instance is not available.');
      return;
    }

    try {
      // Test reading from Firestore
      setStatus('Testing read from Firestore...');
      const testCollectionRef = collection(firestore, 'test_collection');
      const querySnapshot = await getDocs(testCollectionRef);
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
      console.log('Firestore read test successful:', fetchedData);
      setStatus('Read test successful. Testing write...');

      // Test writing to Firestore
      await addDoc(testCollectionRef, { 
        message: 'Hello from TestFirebase component!', 
        timestamp: new Date()
      });
      console.log('Firestore write test successful.');
      setStatus('Write test successful. All tests passed!');
      
    } catch (err) {
      console.error('Firebase test error:', err);
      setError(err.message);
      setStatus('Error during tests');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Firebase Connection Test</h2>
      <button 
        onClick={runTests}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        disabled={status.includes('Testing')}
      >
        {status.includes('Testing') ? 'Running...' : 'Run Firebase Tests'}
      </button>
      <div className="mt-4">
        <p><strong>Status:</strong> {status}</p>
        {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
        {data && (
          <div className="mt-2">
            <h3 className="font-semibold">Data Read:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 