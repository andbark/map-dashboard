'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';

export default function CSVUpload({ onSchoolsLoaded, setLoading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
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
    }
  }, []);
  
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }, []);
  
  const handleSubmit = useCallback(() => {
    if (!file) return;
    
    setLoading(true);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const requiredColumns = ['name', 'address', 'city', 'state', 'zip'];
        const headers = results.meta.fields || [];
        
        const hasMissingColumns = requiredColumns.some(col => !headers.includes(col));
        
        if (hasMissingColumns) {
          alert('CSV file must include these columns: name, address, city, state, zip');
          setLoading(false);
          return;
        }
        
        // Prepare school data with lat/long set to null initially
        const schools = results.data
          .filter(school => school.name && school.address) // Filter out empty rows
          .map(school => ({
            ...school,
            latitude: school.latitude || null,
            longitude: school.longitude || null,
          }));
        
        onSchoolsLoaded(schools);
        
        // Geocode schools without coordinates
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
        setLoading(false);
      }
    });
  }, [file, onSchoolsLoaded, setLoading]);
  
  const handleClearFile = () => {
    setFile(null);
  };

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
      
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 flex flex-col items-center justify-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
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
      ) : (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Required CSV Columns:</h3>
        <div className="grid grid-cols-2 gap-2">
          {['name', 'address', 'city', 'state', 'zip'].map(col => (
            <div key={col} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {col}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <button 
          onClick={handleSubmit}
          disabled={!file}
          className={`btn-primary ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Import Schools
        </button>
        
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