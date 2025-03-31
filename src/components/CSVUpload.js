'use client';

import { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { geocodeSchools } from '../utils/geocoding';
import CustomDropdown from './CustomDropdown';

export default function CSVUpload({ onSchoolsLoaded, setLoading }) {
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
  const [parsedData, setParsedData] = useState([]);
  
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
    setParsedData([]);
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

  // Pre-parse the file to extract headers for mapping
  const preParseFile = useCallback((file) => {
    Papa.parse(file, {
      header: true,
      preview: 5, // Just parse a few rows to get headers
      skipEmptyLines: true,
      complete: (results) => {
        setCsvHeaders(results.meta.fields || []);
        setParsedData(results.data);
        
        // Try to auto-map columns by name similarity
        const newMappings = {...columnMappings};
        const requiredFields = ['School Name', 'Address', 'City', 'State'];
        
        results.meta.fields.forEach(header => {
          // Convert to lowercase for case-insensitive matching
          const headerLower = header.toLowerCase();
          
          if (headerLower.includes('name') || headerLower.includes('school')) {
            newMappings['School Name'] = header;
          } else if (headerLower.includes('address') || headerLower.includes('street')) {
            newMappings['Address'] = header;
          } else if (headerLower.includes('city')) {
            newMappings['City'] = header;
          } else if (headerLower.includes('state')) {
            newMappings['State'] = header;
          } else if (headerLower.includes('district')) {
            newMappings['School District'] = header;
          } else if (headerLower.includes('zip') || headerLower.includes('postal')) {
            newMappings['Zip Code'] = header;
          } else if (headerLower.includes('lat')) {
            newMappings['Latitude'] = header;
          } else if (headerLower.includes('lon') || headerLower.includes('lng')) {
            newMappings['Longitude'] = header;
          }
        });
        
        setColumnMappings(newMappings);
        
        // Check if all required fields are automatically mapped
        const hasAllRequiredMappings = requiredFields.every(field => newMappings[field]);
        setShowColumnMapping(true);
      },
      error: (error) => {
        console.error('Error parsing CSV headers:', error);
        setError('Error reading CSV file headers');
      }
    });
  }, [columnMappings]);
  
  const handleMappingChange = useCallback((field, csvHeader) => {
    setColumnMappings(prev => ({
      ...prev,
      [field]: csvHeader
    }));
  }, []);
  
  const processFile = useCallback(async () => {
    if (!file) return;
    
    // Check if required mappings are set
    const requiredFields = ['School Name', 'Address', 'City', 'State'];
    const missingMappings = requiredFields.filter(field => !columnMappings[field]);
    
    if (missingMappings.length > 0) {
      setError(`Please map the following required fields: ${missingMappings.join(', ')}`);
      return;
    }
    
    setIsProcessing(true);
    setLoading(true);
    setError(null);
    setGeocodingProgress(0);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            console.log('CSV Parse Results:', results);
            
            // Process each row using the column mappings
            const schools = results.data
              .filter(row => {
                // Filter out rows with missing required data
                return row[columnMappings['School Name']] && 
                       row[columnMappings['Address']] && 
                       row[columnMappings['City']] && 
                       row[columnMappings['State']];
              })
              .map((row, index) => ({
                id: `temp-${index}`,
                name: row[columnMappings['School Name']] || '',
                district: columnMappings['School District'] ? (row[columnMappings['School District']] || '') : '',
                address: row[columnMappings['Address']] || '',
                city: row[columnMappings['City']] || '',
                state: row[columnMappings['State']] || '',
                zipCode: columnMappings['Zip Code'] ? (row[columnMappings['Zip Code']] || '') : '',
                // If latitude/longitude are provided in CSV, use them
                latitude: columnMappings['Latitude'] && row[columnMappings['Latitude']] 
                  ? parseFloat(row[columnMappings['Latitude']]) 
                  : undefined,
                longitude: columnMappings['Longitude'] && row[columnMappings['Longitude']] 
                  ? parseFloat(row[columnMappings['Longitude']]) 
                  : undefined
              }));

            console.log('Processed Schools:', schools);
            
            if (schools.length === 0) {
              throw new Error('No valid school data found in the CSV file');
            }

            try {
              // Geocode schools that don't have coordinates
              const geocodedSchools = await geocodeSchools(schools, (progress) => {
                setGeocodingProgress(progress);
              });
              
              console.log('Geocoded Schools:', geocodedSchools);
              
              // Try to save to database
              try {
                onSchoolsLoaded(geocodedSchools);
              } catch (saveError) {
                console.error('Error saving schools to database:', saveError);
                throw new Error(`Failed to save schools to database: ${saveError.message}`);
              }
            } catch (geocodeError) {
              console.error('Error during geocoding:', geocodeError);
              throw new Error(`Geocoding failed: ${geocodeError.message}`);
            }
          } catch (error) {
            console.error('Error processing CSV:', error);
            setError(error.message || 'Error processing CSV file');
          } finally {
            setIsProcessing(false);
            setLoading(false);
            setGeocodingProgress(0);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setError('Error parsing CSV file');
          setIsProcessing(false);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Error processing file');
      setIsProcessing(false);
      setLoading(false);
    }
  }, [file, onSchoolsLoaded, setLoading, columnMappings]);
  
  const handleDownloadSample = useCallback(() => {
    // Use the static sample file instead of generating it on the fly
    window.open('/sample-schools.csv', '_blank');
  }, []);
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Upload School Data</h2>
      
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
              disabled={isProcessing}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      
      {isProcessing && geocodingProgress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Geocoding schools...</span>
            <span>{geocodingProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${geocodingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Column Mapping UI */}
      {showColumnMapping && csvHeaders.length > 0 && (
        <div className="mb-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm csv-mapping-container z-super-high" style={{ position: 'relative', zIndex: 20000 }}>
          <h3 className="text-lg font-semibold mb-4">Map CSV Columns</h3>
          {['School Name', 'Address', 'City', 'State'].map((field) => (
            <div key={field} className="mb-4 flex items-center csv-mapping-parent">
              <label className="w-40 font-medium">{field}: (required)</label>
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
            <div key={field} className="mb-4 flex items-center csv-mapping-parent">
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
          
          {parsedData.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (First Row):</h4>
              <div className="bg-white p-3 rounded border text-xs overflow-x-auto">
                <pre>{JSON.stringify(parsedData[0], null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Required Fields:</h3>
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
          Optional fields: School District, Zip Code, Latitude, Longitude
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <button 
          onClick={processFile}
          disabled={!file || isProcessing || !showColumnMapping}
          className={`btn-primary ${(!file || isProcessing || !showColumnMapping) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing...' : 'Import & Geocode Schools'}
        </button>
        
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