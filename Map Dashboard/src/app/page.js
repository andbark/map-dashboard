'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';

// Dynamically import the Map component with no SSR to avoid window is not defined error
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="card h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-3"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });

  const handleSchoolsLoaded = (newSchools) => {
    setSchools(newSchools);
    setSelectedSchool(null);
    
    // Update viewport to show all schools if any have coordinates
    const schoolsWithCoords = newSchools.filter(s => s.latitude && s.longitude);
    if (schoolsWithCoords.length > 0) {
      // Just center on the first school for simplicity
      setViewport({
        center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
        zoom: 10
      });
    }
  };

  return (
    <main className="container-custom min-h-screen py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="heading-1 mb-3">School Photography Client Map Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A dashboard to manage and visualize school photography clients across different locations.
        </p>
      </div>
      
      {/* Stats Cards */}
      {schools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card bg-indigo-50 border-indigo-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-indigo-100 mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-indigo-700 font-medium">Total Schools</p>
                <p className="text-2xl font-bold text-indigo-900">{schools.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-indigo-50 border-indigo-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-indigo-100 mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-indigo-700 font-medium">States</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {new Set(schools.map(s => s.state)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card bg-indigo-50 border-indigo-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-indigo-100 mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-indigo-700 font-medium">Districts</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {new Set(schools.filter(s => s.district).map(s => s.district)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls and Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CSVUpload onSchoolsLoaded={handleSchoolsLoaded} setLoading={setLoading} />
        <HubSpotIntegration schools={schools} onSchoolsLoaded={handleSchoolsLoaded} setLoading={setLoading} />
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SchoolList 
            schools={schools}
            selectedSchool={selectedSchool}
            onSelectSchool={setSelectedSchool}
          />
        </div>
        
        <div className="lg:col-span-2">
          <Map 
            schools={schools}
            selectedSchool={selectedSchool}
            viewport={viewport}
            setViewport={setViewport}
          />
        </div>
      </div>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-center text-gray-700">Processing data, please wait...</p>
          </div>
        </div>
      )}
    </main>
  );
} 