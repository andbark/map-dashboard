'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { storage, firestore } from '../utils/firebase'; // Import firestore as well
import { ref, uploadBytes, deleteObject } from 'firebase/storage'; 
import { collection, writeBatch, doc, query, where, getDocs } from "firebase/firestore"; // Import firestore functions

export default function CSVUpload({ setLoading }) { // Remove onSchoolsLoaded prop
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState(null); // State to track uploaded file path for deletion
  
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadedFilePath(null); // Clear previous upload path if a new file is dropped
    }
  }, []);
  
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadedFilePath(null); // Clear previous upload path if a new file is selected
    }
  }, []);
  
  const handleSubmit = useCallback(async () => {
    if (!file) return;
    
    setLoading(true);
    setUploadedFilePath(null); // Clear path before attempting upload
    const filePath = `csv_uploads/${Date.now()}_${file.name}`;

    try {
      // 1. Upload CSV to Storage
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      console.log('Uploaded CSV to Firebase Storage successfully!', filePath);
      
      // Keep track of the uploaded file path *after* successful upload
      const currentFile = file; // Keep a reference to the file being processed
      setFile(null); // Clear the selected file input
      setUploadedFilePath(filePath); // Set the path for the delete button

      // 2. Parse the file and upload data to Firestore
      Papa.parse(currentFile, { // Use the file reference
        header: true,
        skipEmptyLines: true, // Good practice to skip empty lines
        complete: async (results) => {
          console.log("CSV Parsed, attempting to write to Firestore...");
          const requiredColumns = ['name', 'address', 'city', 'state', 'zipCode']; // Adjusted zip to zipCode based on likely schema
          const headers = results.meta.fields || [];
          
          const hasMissingColumns = requiredColumns.some(col => !headers.includes(col));
          
          if (hasMissingColumns) {
            alert(`CSV file must include these columns: ${requiredColumns.join(', ')}`);
             // Should we delete the uploaded storage file if parsing fails? Maybe.
             // await deleteUploadedFile(filePath); 
            setLoading(false);
            setUploadedFilePath(null); // Clear path if processing fails
            return;
          }
          
          // Prepare school data batch for Firestore
          const schoolsCollectionRef = collection(firestore, "schools");
          const batch = writeBatch(firestore);
          let schoolsAddedCount = 0;

          results.data.forEach((schoolData) => {
            // Basic validation
            if (schoolData.name && schoolData.address && schoolData.city && schoolData.state && schoolData.zipCode) {
              const newSchoolRef = doc(schoolsCollectionRef); // Auto-generate ID
              batch.set(newSchoolRef, {
                name: schoolData.name || '',
                district: schoolData.district || '', // Add district if present
                address: schoolData.address || '',
                city: schoolData.city || '',
                state: schoolData.state || '',
                zipCode: schoolData.zipCode || '',
                latitude: schoolData.latitude ? parseFloat(schoolData.latitude) : null, // Add lat/lng if present
                longitude: schoolData.longitude ? parseFloat(schoolData.longitude) : null,
                uploadedFile: filePath // Link back to the storage file
              });
              schoolsAddedCount++;
            }
          });
          
          if (schoolsAddedCount > 0) {
            try {
              await batch.commit();
              console.log(`Successfully added ${schoolsAddedCount} schools to Firestore.`);
              alert(`Successfully imported ${schoolsAddedCount} schools.`);
            } catch (firestoreError) {
              console.error("Error writing schools to Firestore:", firestoreError);
              alert("Error saving school data to the database. The CSV was uploaded, but the data couldn't be saved.");
              // Consider deleting the storage file if firestore fails
              // await deleteUploadedFile(filePath);
              setUploadedFilePath(null); // Clear path if firestore write fails
            }
          } else {
             console.log("No valid school rows found in the CSV to add to Firestore.");
             alert("No valid school rows found in the CSV. Please check the file content and required columns.");
             // Consider deleting the storage file
             // await deleteUploadedFile(filePath);
             setUploadedFilePath(null); // Clear path if no data
          }
          
          setLoading(false);
        },
        error: (parseError) => {
          console.error('Error parsing CSV:', parseError);
          alert('Error parsing CSV file. Please check the file format.');
          // Consider deleting the storage file
          // await deleteUploadedFile(filePath);
          setLoading(false);
          setUploadedFilePath(null); // Clear path on parse error
        }
      });

    } catch (storageError) {
      console.error("Error uploading file to Firebase Storage:", storageError);
      alert("Error uploading file. Please try again.");
      setLoading(false);
      setUploadedFilePath(null); // Ensure path is clear on storage error
    }

  }, [file, setLoading]); // Removed onSchoolsLoaded dependency
  
  const handleClearFile = () => {
    setFile(null);
    // Don't clear uploadedFilePath here, only when selecting/dropping a new file or deleting
  };

  // Updated delete function to remove Firestore entries as well
  const deleteUploadedFile = useCallback(async () => {
    if (!uploadedFilePath) {
      console.log("No uploaded file path to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the uploaded file (${uploadedFilePath.split('/').pop()}) and all associated school entries from the database? This action cannot be undone.`
    );

    if (!confirmed) {
      console.log("Deletion cancelled by user.");
      return;
    }

    console.log("Attempting full deletion for:", uploadedFilePath);
    setLoading(true); // Indicate loading state

    try {
      // 1. Find and delete corresponding schools from Firestore
      console.log(`Querying Firestore for schools with uploadedFile == ${uploadedFilePath}`);
      const schoolsCollectionRef = collection(firestore, "schools");
      const q = query(schoolsCollectionRef, where("uploadedFile", "==", uploadedFilePath));
      
      const querySnapshot = await getDocs(q);
      let schoolsToDeleteCount = querySnapshot.size;
      console.log(`Found ${schoolsToDeleteCount} school documents to delete.`);

      if (schoolsToDeleteCount > 0) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        console.log("Executing Firestore batch delete...");
        await batch.commit();
        console.log("Successfully deleted school entries from Firestore.");
      } else {
        console.log("No matching school entries found in Firestore (already deleted or path mismatch?).");
      }

      // 2. Delete the file from Firebase Storage
      console.log("Deleting file from Firebase Storage...");
      const fileRef = ref(storage, uploadedFilePath);
      await deleteObject(fileRef);
      console.log(`Successfully deleted file from Storage: ${uploadedFilePath}`);
      
      alert(`Successfully deleted uploaded file and ${schoolsToDeleteCount} associated school entries.`);
      setUploadedFilePath(null); // Clear the path after successful deletion

    } catch (error) {
      console.error(`Error during full deletion process for ${uploadedFilePath}:`, error);
      alert(`Failed to complete deletion for ${uploadedFilePath.split('/').pop()}. Some data might remain. Check console for details.`);
      // We don't clear uploadedFilePath here, so the user can potentially retry
    } finally {
       setLoading(false); // Turn off loading state
    }
  }, [uploadedFilePath, setLoading]); // Added setLoading dependency

  const handleDownloadSample = () => {
    const sampleData = `name,address,city,state,zip,district
John Adams Elementary,123 School St,Springfield,IL,62701,District 186
Lincoln High School,456 Education Ave,Springfield,IL,62704,District 186
Washington Middle School,789 Learning Blvd,Springfield,IL,62702,District 186`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_schools.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="card">
      <h2 className="heading-2 mb-4">Upload School Data</h2>
      
      {/* Show Dropzone if no file selected AND no file successfully uploaded */} 
      {!file && !uploadedFilePath && (
         // ... existing dropzone JSX ...
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 flex flex-col items-center justify-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
           {/* ... content of dropzone ... */}
           <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV file with school data</p>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="mt-4 btn-primary cursor-pointer">
            Select CSV File
          </label>
        </div>
      )}

      {/* Show selected file info if a file is selected but not yet submitted */} 
      {file && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            {/* ... icon and file name ... */}
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="font-medium text-gray-900">{file.name}</span>
            </div>
            <button 
              onClick={handleClearFile}
              className="text-gray-500 hover:text-gray-700"
            >
              {/* ... clear icon ... */}
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Show uploaded file info and Delete button if a file was successfully uploaded */} 
      {uploadedFilePath && (
         <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span className="font-medium text-green-900">Uploaded: {uploadedFilePath.split('/').pop()}</span>
             </div>
             <button 
               onClick={deleteUploadedFile} 
               className="btn-secondary-danger text-sm"
             >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
               Delete Upload & Data
             </button>
           </div>
         </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Required CSV Columns:</h3>
         {/* ... column list ... */} 
        <div className="grid grid-cols-2 gap-2">
          {['name', 'address', 'city', 'state', 'zipCode'].map(col => (
            <div key={col} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {col}
            </div>
          ))}
        </div>
         <p className="text-xs text-gray-500 mt-1">Optional: district, latitude, longitude</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        {/* Submit button only enabled if a file is selected */} 
        <button 
          onClick={handleSubmit}
          disabled={!file} 
          className={`btn-primary ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Import Schools
        </button>
        
        {/* Download Sample Button */} 
        <button
          onClick={handleDownloadSample}
          className="btn-secondary"
        >
          Download Sample CSV
        </button>
      </div>
    </div>
  );
} 