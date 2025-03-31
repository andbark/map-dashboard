'use client';

import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';

export default function CSVUpload({ onSchoolsLoaded, enableAddToDefault }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [geocodingInProgress, setGeocodingInProgress] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [addToDefaultDataset, setAddToDefaultDataset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldMapping, setFieldMapping] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  
  // Add geocoding cache
  const geocodingCache = useRef(new Map());
  
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
  
  const geocodeAddress = async (address, city, state, zip) => {
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    const cacheKey = fullAddress.toLowerCase().trim();
    
    // Check cache first
    if (geocodingCache.current.has(cacheKey)) {
      return geocodingCache.current.get(cacheKey);
    }
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      const result = data.length > 0 
        ? { latitude: data[0].lat, longitude: data[0].lon }
        : { latitude: null, longitude: null };
      
      // Cache the result
      geocodingCache.current.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return { latitude: null, longitude: null };
    }
  };
  
  const geocodeSchools = async (schools) => {
    setGeocodingInProgress(true);
    setGeocodingProgress(0);
    
    const totalSchools = schools.length;
    const batchSize = 10; // Process 10 schools at a time
    const geocodedSchools = [];
    
    for (let i = 0; i < totalSchools; i += batchSize) {
      const batch = schools.slice(i, i + batchSize);
      const batchPromises = batch.map(async (school) => {
        if (school.latitude && school.longitude) {
          return school;
        }
        
        // Add a small random delay between 100-300ms to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        
        const { latitude, longitude } = await geocodeAddress(
          school.address, 
          school.city, 
          school.state, 
          school.zip
        );
        
        return {
          ...school,
          latitude,
          longitude
        };
      });
      
      const batchResults = await Promise.all(batchPromises);
      geocodedSchools.push(...batchResults);
      
      // Update progress
      const progress = Math.round(((i + batchSize) / totalSchools) * 100);
      setGeocodingProgress(Math.min(progress, 100));
    }
    
    setGeocodingInProgress(false);
    return geocodedSchools;
  };
  
  const parseFile = useCallback(() => {
    if (!file) return;
    
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      preview: 1, // Just need the headers
      complete: (results) => {
        const headers = results.meta.fields || [];
        setCsvHeaders(headers);
        
        const requiredColumns = ['name', 'address', 'city', 'state', 'zip'];
        const hasMissingColumns = requiredColumns.some(col => !headers.includes(col));
        
        if (hasMissingColumns) {
          // Setup initial mapping suggestions - try to match similar column names
          const initialMapping = {...fieldMapping};
          
          requiredColumns.forEach(reqField => {
            // Try to find exact match first
            if (headers.includes(reqField)) {
              initialMapping[reqField] = reqField;
            } else {
              // Try to find close matches
              const possibleMatches = headers.filter(header => 
                header.toLowerCase().includes(reqField.toLowerCase()) ||
                reqField.toLowerCase().includes(header.toLowerCase())
              );
              
              if (possibleMatches.length > 0) {
                initialMapping[reqField] = possibleMatches[0];
              }
            }
          });
          
          setFieldMapping(initialMapping);
          setShowMapping(true);
          setIsLoading(false);
        } else {
          // All required fields exist, process file directly
          processCsvData(headers, false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
        setIsLoading(false);
      }
    });
  }, [file, fieldMapping]);
  
  const processCsvData = useCallback(async (headers, useMapping = false) => {
    const config = {
      header: true,
      worker: true, // Enable worker thread
      skipEmptyLines: true, // Skip empty lines to reduce processing
      fastMode: true, // Enable fast mode for basic CSV parsing
      complete: async (results) => {
        // Filter out invalid rows first to reduce processing
        const validSchools = results.data.filter(school => {
          if (useMapping) {
            return school[fieldMapping.name]?.trim() && school[fieldMapping.address]?.trim();
          }
          return school.name?.trim() && school.address?.trim();
        });

        // Process schools in chunks to avoid memory issues
        const chunkSize = 100;
        const processedSchools = [];
        
        for (let i = 0; i < validSchools.length; i += chunkSize) {
          const chunk = validSchools.slice(i, i + chunkSize);
          const processedChunk = chunk.map(school => {
            if (useMapping) {
              return {
                name: school[fieldMapping.name]?.trim() || '',
                address: school[fieldMapping.address]?.trim() || '',
                city: school[fieldMapping.city]?.trim() || '',
                state: school[fieldMapping.state]?.trim() || '',
                zip: school[fieldMapping.zip]?.trim() || '',
                district: school.district || '',
                latitude: school.latitude || null,
                longitude: school.longitude || null,
                originalRecord: {...school}
              };
            }
            
            return {
              ...school,
              name: school.name?.trim(),
              address: school.address?.trim(),
              city: school.city?.trim(),
              state: school.state?.trim(),
              zip: school.zip?.trim(),
              latitude: school.latitude || null,
              longitude: school.longitude || null,
            };
          });
          
          processedSchools.push(...processedChunk);
        }
        
        // Now geocode the schools
        const schoolsWithCoordinates = await geocodeSchools(processedSchools);
        onSchoolsLoaded(schoolsWithCoordinates, addToDefaultDataset);
        
        setShowMapping(false);
        setIsLoading(false);
        setAddToDefaultDataset(false);
      },
      error: (error) => {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV file');
        setIsLoading(false);
      }
    };
    
    Papa.parse(file, config);
  }, [file, onSchoolsLoaded, fieldMapping, addToDefaultDataset]);
  
  const handleSubmit = () => {
    if (!file) return;
    parseFile();
  };
  
  const handleApplyMapping = () => {
    // Check if all required fields are mapped
    const mappingComplete = Object.values(fieldMapping).every(value => value);
    
    if (!mappingComplete) {
      alert('Please map all required fields to continue');
      return;
    }
    
    setIsLoading(true);
    processCsvData(csvHeaders, true);
  };
  
  const handleClearFile = () => {
    setFile(null);
    setCsvHeaders([]);
    setShowMapping(false);
    setFieldMapping({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    });
  };

  const handleDownloadSample = () => {
    const sampleData = `name,address,city,state,zip,district,latitude,longitude
John Adams Elementary,123 School St,Springfield,IL,62701,District 186,39.7817,-89.6501
Lincoln High School,456 Education Ave,Springfield,IL,62704,District 186,39.7911,-89.6651
Washington Middle School,789 Learning Blvd,Springfield,IL,62702,District 186,39.8001,-89.6701`;
    
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
  
  const handleMappingChange = (field, value) => {
    setFieldMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div>
      <p className="text-gray-600 mb-4">
        Upload a CSV file with school data or drag and drop schools on the map.
      </p>
      
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
      
      {geocodingInProgress && (
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
      
      {showMapping ? (
        <div className="mb-4 border border-indigo-100 rounded-lg p-4 bg-indigo-50">
          <h3 className="text-sm font-semibold text-indigo-800 mb-3">Map Your CSV Columns to Required Fields</h3>
          <p className="text-xs text-indigo-600 mb-4">
            Your CSV doesn't have all the required column names. Please map your CSV columns to the required fields below.
          </p>
          
          <div className="space-y-3">
            {Object.keys(fieldMapping).map(field => (
              <div key={field} className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-gray-700 col-span-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <select 
                  className="form-select col-span-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={fieldMapping[field]} 
                  onChange={(e) => handleMappingChange(field, e.target.value)}
                >
                  <option value="">Select a column</option>
                  {csvHeaders.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          {enableAddToDefault && (
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="add-to-default-mapping"
                checked={addToDefaultDataset}
                onChange={e => setAddToDefaultDataset(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="add-to-default-mapping" className="ml-2 block text-sm text-indigo-800">
                Add these schools to the default dataset
              </label>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleApplyMapping}
              className="btn-primary text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Apply Mapping & Geocode'}
            </button>
          </div>
        </div>
      ) : (
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
          <p className="text-xs text-gray-500 mt-1">
            Don't worry if your CSV has different column names - we'll help you map them. 
            We'll also automatically geocode addresses to display on the map.
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        {!showMapping && !geocodingInProgress && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <button 
                onClick={handleSubmit}
                disabled={!file || isLoading}
                className={`btn-primary ${(!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Import & Geocode Schools'}
              </button>
              
              {enableAddToDefault && file && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="add-to-default"
                    checked={addToDefaultDataset}
                    onChange={e => setAddToDefaultDataset(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="add-to-default" className="ml-2 block text-sm text-gray-700">
                    Add to default dataset
                  </label>
                </div>
              )}
            </div>
            
            <button
              onClick={handleDownloadSample}
              className="btn-secondary w-full sm:w-auto"
              disabled={geocodingInProgress}
            >
              Download Sample CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 