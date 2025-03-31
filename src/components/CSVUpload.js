'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { geocodeSchools } from '../utils/geocoding';

export default function CSVUpload({ onSchoolsLoaded, setLoading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  
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
  
  const processFile = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setLoading(true);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Process each row from the CSV
            const schools = results.data
              .filter(row => {
                // Filter out rows with missing required data
                return row['School Name'] && 
                       row['Address'] && 
                       row['City'] && 
                       row['State'];
              })
              .map(row => ({
                name: row['School Name'] || '',
                district: row['School District'] || '',
                address: row['Address'] || '',
                city: row['City'] || '',
                state: row['State'] || '',
                zipCode: row['Zip Code'] || '',
                // If latitude/longitude are provided in CSV, use them
                latitude: row['Latitude'] ? parseFloat(row['Latitude']) : undefined,
                longitude: row['Longitude'] ? parseFloat(row['Longitude']) : undefined
              }));

            // Geocode schools that don't have coordinates
            const geocodedSchools = await geocodeSchools(schools, (progress) => {
              setGeocodingProgress(progress);
            });
            
            onSchoolsLoaded(geocodedSchools);
          } catch (error) {
            console.error('Error processing CSV:', error);
            alert('Error processing CSV file');
          } finally {
            setIsProcessing(false);
            setLoading(false);
            setGeocodingProgress(0);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file');
          setIsProcessing(false);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file');
      setIsProcessing(false);
      setLoading(false);
    }
  }, [file, onSchoolsLoaded, setLoading]);
  
  const handleClearFile = () => {
    setFile(null);
    setIsProcessing(false);
    setGeocodingProgress(0);
  };

  const handleDownloadSample = () => {
    const sampleData = `School Name,School District,Address,City,State,Zip Code,Latitude,Longitude
John Adams Elementary,District 186,123 School St,Springfield,IL,62701,39.7817,-89.6501
Lincoln High School,District 186,456 Education Ave,Springfield,IL,62704,39.7911,-89.6651
Washington Middle School,District 186,789 Learning Blvd,Springfield,IL,62702,39.8001,-89.6701`;
    
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
      
      {geocodingProgress > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-700 mb-2">Geocoding Addresses...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${geocodingProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Converting addresses to map coordinates: {geocodingProgress}% complete
          </p>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Required CSV Columns:</h3>
        <div className="grid grid-cols-2 gap-2">
          {['School Name', 'Address', 'City', 'State'].map(col => (
            <div key={col} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {col}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Optional columns: School District, Zip Code, Latitude, Longitude
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        {file && !isProcessing && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <button 
                onClick={processFile}
                disabled={!file || isProcessing}
                className={`btn-primary ${(!file || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Processing...' : 'Import & Geocode Schools'}
              </button>
            </div>
            
            <button
              onClick={handleDownloadSample}
              className="btn-secondary w-full sm:w-auto"
              disabled={isProcessing}
            >
              Download Sample CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 