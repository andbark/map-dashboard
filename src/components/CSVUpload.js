'use client';

import { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { geocodeSchools } from '../utils/geocoding';
import CustomDropdown from './CustomDropdown';
import { firestore } from '../utils/firebase';
import { collection, writeBatch, doc } from "firebase/firestore";

export default function CSVUpload({ setLoading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showColumnMapping, setShowColumnMapping] = useState(false);
  const [columnMappings, setColumnMappings] = useState({
    'School Name': '',
    'Address': '',
    'City': '',
    'State': '',
    'School District': '',
    'Zip Code': '',
    'Latitude': '',
    'Longitude': ''
  });

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
      preParseFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      preParseFile(e.target.files[0]);
    }
  }, []);
  
  const handleClearFile = useCallback(() => {
    setFile(null);
    setError(null);
    setGeocodingProgress(0);
    setCsvHeaders([]);
    setShowColumnMapping(false);
    setColumnMappings({
      'School Name': '',
      'Address': '',
      'City': '',
      'State': '',
      'School District': '',
      'Zip Code': '',
      'Latitude': '',
      'Longitude': ''
    });
  }, []);

  const preParseFile = useCallback((file) => {
    Papa.parse(file, {
      header: true,
      preview: 5,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvHeaders(results.meta.fields || []);
        
        const newMappings = {
            'School Name': '',
            'Address': '',
            'City': '',
            'State': '',
            'School District': '',
            'Zip Code': '',
            'Latitude': '',
            'Longitude': ''
        };
        const requiredFields = ['School Name', 'Address', 'City', 'State'];
        
        results.meta.fields.forEach(header => {
          const headerLower = header.toLowerCase();
          
          if (!newMappings['School Name'] && (headerLower.includes('name') || headerLower.includes('school'))) {
            newMappings['School Name'] = header;
          } else if (!newMappings['Address'] && (headerLower.includes('address') || headerLower.includes('street'))) {
            newMappings['Address'] = header;
          } else if (!newMappings['City'] && headerLower.includes('city')) {
            newMappings['City'] = header;
          } else if (!newMappings['State'] && headerLower.includes('state')) {
            newMappings['State'] = header;
          } else if (!newMappings['School District'] && headerLower.includes('district')) {
            newMappings['School District'] = header;
          } else if (!newMappings['Zip Code'] && (headerLower.includes('zip') || headerLower.includes('postal'))) {
            newMappings['Zip Code'] = header;
          } else if (!newMappings['Latitude'] && headerLower.includes('lat')) {
            newMappings['Latitude'] = header;
          } else if (!newMappings['Longitude'] && (headerLower.includes('lon') || headerLower.includes('lng'))) {
            newMappings['Longitude'] = header;
          }
        });
        
        setColumnMappings(newMappings);
        
        setShowColumnMapping(true);
      },
      error: (error) => {
        console.error('Error parsing CSV headers:', error);
        setError('Error reading CSV file headers');
      }
    });
  }, []);
  
  const handleMappingChange = useCallback((field, csvHeader) => {
    setColumnMappings(prev => ({
      ...prev,
      [field]: csvHeader
    }));
  }, []);
  
  const processFile = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setLoading(true);
    setError(null);
    setGeocodingProgress(0);
    const currentFileName = file.name;
    console.log("Starting CSV file processing for:", currentFileName);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            console.log("Full CSV parsing complete.");
            
            if (results.data.length === 0) {
              throw new Error('The CSV file contains no data');
            }
            
            const requiredFields = ['School Name', 'Address', 'City', 'State'];
            if (requiredFields.some(field => !columnMappings[field])) {
              throw new Error('Please map all required fields (School Name, Address, City, State) before uploading');
            }
            
            const schoolsToProcess = results.data
              .filter(row => {
                return columnMappings['School Name'] && row[columnMappings['School Name']] && 
                       columnMappings['Address'] && row[columnMappings['Address']] && 
                       columnMappings['City'] && row[columnMappings['City']] && 
                       columnMappings['State'] && row[columnMappings['State']];
              })
              .map((row, index) => ({
                name: row[columnMappings['School Name']] || '',
                district: columnMappings['School District'] ? (row[columnMappings['School District']] || '') : '',
                address: row[columnMappings['Address']] || '',
                city: row[columnMappings['City']] || '',
                state: row[columnMappings['State']] || '',
                zipCode: columnMappings['Zip Code'] ? (row[columnMappings['Zip Code']] || '') : '',
                latitude: columnMappings['Latitude'] && row[columnMappings['Latitude']] 
                  ? parseFloat(row[columnMappings['Latitude']]) 
                  : undefined,
                longitude: columnMappings['Longitude'] && row[columnMappings['Longitude']] 
                  ? parseFloat(row[columnMappings['Longitude']]) 
                  : undefined
              }));

            console.log('Total Schools After Mapping & Filtering:', schoolsToProcess.length);
            
            if (schoolsToProcess.length === 0) {
              throw new Error('No valid school data found in the CSV file after applying mappings.');
            }

            let finalSchools = schoolsToProcess;

            const schoolsNeedingGeocoding = schoolsToProcess.filter(s => s.latitude === undefined || s.longitude === undefined);
            if (schoolsNeedingGeocoding.length > 0) {
                console.log(`Starting geocoding for ${schoolsNeedingGeocoding.length} schools...`);
                try {
                    finalSchools = await geocodeSchools(schoolsToProcess, (progress) => {
                        setGeocodingProgress(progress);
                    });
                    console.log(`Geocoding complete. Final school count: ${finalSchools.length}`);
                } catch (geocodeError) {
                    console.error('Error during geocoding process, proceeding with available coordinates:', geocodeError);
                    setError(`Geocoding failed: ${geocodeError.message}. Some schools may not appear on map.`);
                }
            } else {
                console.log("No geocoding needed, all schools have coordinates.");
            }
              
            console.log('Attempting to save schools to Firestore...');
            const schoolsCollectionRef = collection(firestore, "schools");
            const batch = writeBatch(firestore);
            let schoolsAddedCount = 0;

            finalSchools.forEach((schoolData) => {
                if (schoolData.name && schoolData.address && schoolData.city && schoolData.state) {
                    const newSchoolRef = doc(schoolsCollectionRef);
                    batch.set(newSchoolRef, {
                        name: schoolData.name,
                        district: schoolData.district || '',
                        address: schoolData.address,
                        city: schoolData.city,
                        state: schoolData.state,
                        zipCode: schoolData.zipCode || '',
                        latitude: schoolData.latitude === undefined ? null : schoolData.latitude,
                        longitude: schoolData.longitude === undefined ? null : schoolData.longitude,
                        uploadedFrom: currentFileName
                    });
                    schoolsAddedCount++;
                }
            });

            if (schoolsAddedCount > 0) {
                await batch.commit();
                console.log(`Successfully added ${schoolsAddedCount} schools to Firestore.`);
                alert(`Successfully imported ${schoolsAddedCount} schools.`);
                handleClearFile(); 
            } else {
                throw new Error("No schools were eligible for saving after processing.");
            }

          } catch (processingError) {
            console.error('Error processing CSV data or saving to Firestore:', processingError);
            setError(processingError.message || 'Error processing CSV file');
          } finally {
            setIsProcessing(false);
            setLoading(false);
            setGeocodingProgress(0);
          }
        },
        error: (parseError) => {
          console.error('Error parsing CSV file with Papa Parse:', parseError);
          setError('Error parsing CSV file');
          setIsProcessing(false);
          setLoading(false);
        }
      });
    } catch (outerError) {
      console.error('General error before file processing:', outerError);
      setError(outerError.message || 'Error processing file');
      setIsProcessing(false);
      setLoading(false);
    }
  }, [file, setLoading, columnMappings, handleClearFile]);
  
  const handleDownloadSample = useCallback(() => {
    window.open('/sample-schools.csv', '_blank');
  }, []);
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Upload School Data</h2>
      
      {!file && (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 flex flex-col items-center justify-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      
      {file && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="font-medium text-gray-900">{file.name}</span>
            </div>
            <button 
              onClick={handleClearFile}
              className="text-gray-500 hover:text-gray-700"
              disabled={isProcessing}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="font-medium text-blue-700">Processing & Geocoding... Please wait.</span>
          </div>
          {geocodingProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-width duration-300 ease-linear" 
                style={{ width: `${geocodingProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      
      {file && showColumnMapping && !isProcessing && (
        <div className="mb-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Map CSV Columns</h3>
          {['School Name', 'Address', 'City', 'State'].map((field) => (
            <div key={field} className="mb-4 flex items-center">
              <label className="w-40 font-medium">{field}: <span className="text-red-600">*</span></label>
              <CustomDropdown
                value={columnMappings[field] || ''}
                onChange={(value) => handleMappingChange(field, value)}
                options={[
                  { value: '', label: 'Select column' },
                  ...csvHeaders.map(header => ({ value: header, label: header }))
                ]}
                className="w-64"
              />
            </div>
          ))}
          
          {['School District', 'Zip Code', 'Latitude', 'Longitude'].map((field) => (
            <div key={field} className="mb-4 flex items-center">
              <label className="w-40 font-medium">{field}:</label>
              <CustomDropdown
                value={columnMappings[field] || ''}
                onChange={(value) => handleMappingChange(field, value)}
                options={[
                  { value: '', label: 'Select column' },
                  ...csvHeaders.map(header => ({ value: header, label: header }))
                ]}
                className="w-64"
              />
            </div>
          ))}
          
          <p className="text-xs text-gray-500 mt-1"><span className="text-red-600">*</span> Required fields must be mapped.</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        {file && showColumnMapping && (
             <button 
              onClick={processFile}
              disabled={isProcessing || !file || !showColumnMapping || ['School Name', 'Address', 'City', 'State'].some(f => !columnMappings[f])}
              className={`btn-primary ${ (isProcessing || !file || !showColumnMapping || ['School Name', 'Address', 'City', 'State'].some(f => !columnMappings[f])) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Processing...' : 'Import & Geocode Schools'}
            </button>
        )}
       
        <button
          onClick={handleDownloadSample}
          className="btn-secondary"
          disabled={isProcessing}
        >
          Download Sample CSV
        </button>
      </div>
    </div>
  );
} 