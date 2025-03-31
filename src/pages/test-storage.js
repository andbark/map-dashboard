import { useState, useEffect } from 'react';
import { ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../lib/firebase';

export default function TestStorage() {
  const [uploadResult, setUploadResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to test uploading a simple text file
  const testUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a test file with current timestamp
      const timestamp = new Date().toISOString();
      const content = `Test file created at ${timestamp}`;
      const fileName = `test-${Date.now()}.txt`;
      
      // Create a reference to the file
      const storageRef = ref(storage, `test/${fileName}`);
      
      // Upload as a string
      const snapshot = await uploadString(storageRef, content, 'raw');
      
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      
      setUploadResult({
        success: true,
        fileName,
        url,
        timestamp
      });
      
      // Refresh file list
      await listFiles();
    } catch (err) {
      console.error('Error testing storage:', err);
      setError(err.message);
      setUploadResult({
        success: false,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to list files in the test directory
  const listFiles = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, 'test');
      const result = await listAll(listRef);
      
      // Get download URLs for all items
      const filePromises = result.items.map(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        } catch (error) {
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            error: error.message
          };
        }
      });
      
      const fileDetails = await Promise.all(filePromises);
      setFiles(fileDetails);
    } catch (err) {
      console.error('Error listing files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load files on component mount
  useEffect(() => {
    listFiles();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Firebase Storage Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Storage Configuration</h2>
        <div className="bg-gray-100 p-3 rounded">
          <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={testUpload}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Upload to Storage'}
        </button>
        
        <button 
          onClick={listFiles}
          disabled={loading}
          className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          Refresh File List
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {uploadResult && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-bold mb-2">Upload Result:</h3>
          {uploadResult.success ? (
            <div>
              <p className="text-green-600 font-semibold">Upload successful!</p>
              <p>Filename: {uploadResult.fileName}</p>
              <p>Created at: {uploadResult.timestamp}</p>
              <p>
                <a 
                  href={uploadResult.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              </p>
            </div>
          ) : (
            <div className="text-red-600">
              <p>Upload failed: {uploadResult.error}</p>
            </div>
          )}
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Files in Storage</h2>
        {loading && <p className="text-gray-500">Loading files...</p>}
        
        {files.length === 0 && !loading ? (
          <p className="italic text-gray-500">No files found</p>
        ) : (
          <ul className="border rounded divide-y">
            {files.map((file, index) => (
              <li key={index} className="p-3 hover:bg-gray-50">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{file.fullPath}</p>
                {file.url ? (
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Download
                  </a>
                ) : (
                  <p className="text-red-500 text-sm">{file.error}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 