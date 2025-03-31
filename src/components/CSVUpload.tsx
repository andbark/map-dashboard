import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { geocodeSchools } from '../utils/geocoding';

interface School {
  id?: string;
  name: string;
  district: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface CSVUploadProps {
  onSchoolsLoaded: (schools: School[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function CSVUpload({ onSchoolsLoaded, setLoading }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleDownloadSample = () => {
    const sampleData = [
      ['School Name', 'School District', 'Address', 'City', 'State', 'Zip Code'],
      ['Example High School', 'Example School District', '123 Main St', 'Example City', 'EX', '12345']
    ];
    
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_schools.csv';
    link.click();
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setGeocodingProgress(0);

    try {
      // Parse CSV file
      const result = await new Promise<School[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const schools: School[] = [];
            
            // Process each row from the CSV
            results.data.forEach((row: any) => {
              // Map CSV columns to our School type
              const school: School = {
                name: row['School Name'] || '',
                district: row['School District'] || '',
                address: row['Address'] || '',
                city: row['City'] || '',
                state: row['State'] || '',
                zipCode: row['Zip Code'] || '',
              };
              
              // Only add valid schools with required data
              if (school.name && school.address && school.city && school.state) {
                schools.push(school);
              }
            });
            
            resolve(schools);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      if (result.length === 0) {
        throw new Error('No valid schools found in the CSV file');
      }

      // Geocode schools that don't have coordinates
      const geocodedSchools = await geocodeSchools(result, (progress) => {
        setGeocodingProgress(Math.round(progress));
      });

      // Pass the processed schools to the parent component
      onSchoolsLoaded(geocodedSchools);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
      setGeocodingProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the CSV file here'
              : 'Drag and drop a CSV file here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported format: CSV with School Name, Address, City, State columns
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isProcessing && geocodingProgress > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
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
              <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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