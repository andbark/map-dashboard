'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';
import AdminTools from '../components/AdminTools';
import TabsContainer from '../components/TabsContainer';

// Dynamically import the Map component with no SSR to avoid window is not defined error
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="card h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-3"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataFromStorage, setDataFromStorage] = useState(false);
  const [dataFromDatabase, setDataFromDatabase] = useState(false);
  const [usingPreloadedData, setUsingPreloadedData] = useState(false);
  const [defaultDataset, setDefaultDataset] = useState([]);
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });

  // Load saved schools from localStorage or database on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      try {
        // First try to load from database
        const dbSchools = await loadFromDatabase();
        
        if (dbSchools.length > 0) {
          // If there are schools in the database, use those
          setSchools(dbSchools);
          setDataFromDatabase(true);
          setDataFromStorage(false);
          setUsingPreloadedData(false);
          
          // Set viewport to first school with coordinates if available
          setViewportToSchools(dbSchools);
          setLoading(false);
          return;
        }
        
        // Otherwise, check localStorage
        const savedSchools = localStorage.getItem('mapDashboardSchools');
        
        // Also load the default dataset for potential use
        const defaultData = await loadDefaultDataset();
        setDefaultDataset(defaultData);
        
        if (savedSchools) {
          try {
            const parsedSchools = JSON.parse(savedSchools);
            setSchools(parsedSchools);
            setDataFromStorage(true);
            
            // Set viewport to schools
            setViewportToSchools(parsedSchools);
          } catch (error) {
            console.error('Error loading saved schools:', error);
            // If there's an error loading from storage, use default data
            setSchools(defaultData);
            setUsingPreloadedData(true);
            setViewportToSchools(defaultData);
          }
        } else {
          // If no saved schools, use default data
          setSchools(defaultData);
          setUsingPreloadedData(true);
          setViewportToSchools(defaultData);
        }
      } catch (error) {
        console.error('Error in initial data loading:', error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const loadFromDatabase = async () => {
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('Failed to load schools from database');
      }
      
      const data = await response.json();
      return data.schools || [];
    } catch (error) {
      console.error('Error loading from database:', error);
      return [];
    }
  };

  const setViewportToSchools = (schools) => {
    const schoolsWithCoords = schools.filter(s => s.latitude && s.longitude);
    if (schoolsWithCoords.length > 0) {
      setViewport({
        center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
        zoom: 10
      });
    }
  };

  const loadDefaultDataset = async () => {
    try {
      // Check for custom default dataset first
      const customDefault = localStorage.getItem('mapDashboardDefaultDataset');
      if (customDefault) {
        return JSON.parse(customDefault);
      }
      
      // Otherwise load from the JSON file
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Failed to load preloaded school data');
      }
      
      const data = await response.json();
      return data.schools;
    } catch (error) {
      console.error('Error loading default dataset:', error);
      return [];
    }
  };

  const loadPreloadedData = async () => {
    setLoading(true);
    try {
      setSchools(defaultDataset);
      setUsingPreloadedData(true);
      setDataFromStorage(false);
      setDataFromDatabase(false);
      setViewportToSchools(defaultDataset);
    } catch (error) {
      console.error('Error loading preloaded data:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      const dbSchools = await loadFromDatabase();
      setSchools(dbSchools);
      setDataFromDatabase(true);
      setDataFromStorage(false);
      setUsingPreloadedData(false);
      setViewportToSchools(dbSchools);
    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolsLoaded = (newSchools, addToDefault = false) => {
    setSchools(newSchools);
    setSelectedSchool(null);
    setDataFromStorage(false);
    setDataFromDatabase(false);
    setUsingPreloadedData(false);
    
    // If adding to default dataset
    if (addToDefault) {
      addToDefaultDataset(newSchools);
    }
    
    // Update viewport
    setViewportToSchools(newSchools);
  };

  const addToDefaultDataset = (newSchools) => {
    // Create a new array combining existing default and new schools
    const updatedDefaultDataset = [...defaultDataset, ...newSchools];
    
    // Update the default dataset state
    setDefaultDataset(updatedDefaultDataset);
    
    // Save to localStorage
    localStorage.setItem('mapDashboardDefaultDataset', JSON.stringify(updatedDefaultDataset));
    
    alert('Schools have been added to the default dataset. Use "Reset to Default Dataset" to view the updated default dataset.');
  };

  const handleSaveData = () => {
    try {
      localStorage.setItem('mapDashboardSchools', JSON.stringify(schools));
      setDataFromStorage(true);
      setDataFromDatabase(false);
      setUsingPreloadedData(false);
      alert('Schools data saved successfully to local storage!');
    } catch (error) {
      console.error('Error saving schools data:', error);
      alert('Failed to save schools data');
    }
  };

  const handleClearSavedData = () => {
    if (confirm('Are you sure you want to clear all saved school data? This cannot be undone.')) {
      localStorage.removeItem('mapDashboardSchools');
      setDataFromStorage(false);
      // Load the preloaded data after clearing
      loadPreloadedData();
      alert('Saved schools data has been cleared and preloaded data restored.');
    }
  };

  const handleResetToPreloadedData = () => {
    if (confirm('Are you sure you want to reset to the preloaded school data? Any unsaved changes will be lost.')) {
      loadPreloadedData();
      alert('Data has been reset to preloaded schools.');
    }
  };

  const handleWipeDefaultDataset = () => {
    if (confirm('Are you sure you want to wipe the default dataset? This will remove all schools from the default dataset. This cannot be undone.')) {
      // Clear the custom default dataset from localStorage
      localStorage.removeItem('mapDashboardDefaultDataset');
      
      // Reset the default dataset to empty
      setDefaultDataset([]);
      
      // If we're currently using the preloaded data, set schools to empty
      if (usingPreloadedData) {
        setSchools([]);
      }
      
      alert('Default dataset has been wiped.');
    }
  };

  const handleSaveAsDefault = () => {
    if (confirm('Are you sure you want to save the current dataset as the new default? This will replace the existing default dataset.')) {
      // Save current schools as the new default dataset
      localStorage.setItem('mapDashboardDefaultDataset', JSON.stringify(schools));
      
      // Update default dataset state
      setDefaultDataset(schools);
      
      alert('Current dataset has been saved as the new default dataset.');
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
      
      {/* Data Source Indicators */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {usingPreloadedData && (
          <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-blue-700 text-sm">Using preloaded school dataset</span>
          </div>
        )}
        
        {dataFromStorage && schools.length > 0 && (
          <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-green-700 text-sm">Using saved school data from local storage</span>
          </div>
        )}
        
        {dataFromDatabase && schools.length > 0 && (
          <div className="flex items-center bg-purple-50 p-3 rounded-lg border border-purple-200">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
            </svg>
            <span className="text-purple-700 text-sm">Using school data from shared database</span>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      {schools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card bg-indigo-50 border-indigo-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-indigo-100 mr-4">
                <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      
      {/* Tools & Integrations Tabs */}
      <div className="mb-8">
        <h2 className="heading-2 mb-4">Tools & Integrations</h2>
        <TabsContainer labels={['CSV Upload', 'HubSpot Integration', 'Admin Tools']}>
          <CSVUpload 
            onSchoolsLoaded={handleSchoolsLoaded} 
            setLoading={setLoading}
            enableAddToDefault={true}
          />
          <HubSpotIntegration 
            schools={schools} 
            onSchoolsLoaded={handleSchoolsLoaded} 
            setLoading={setLoading} 
          />
          <AdminTools 
            onSchoolsLoaded={schools} 
            setLoading={setLoading} 
          />
        </TabsContainer>
      </div>
      
      {/* Data Management Buttons */}
      {schools.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-4">
          <button 
            onClick={handleSaveData}
            className="btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save to Local Storage
          </button>
          
          <button 
            onClick={handleSaveAsDefault}
            className="btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save as Default Dataset
          </button>
          
          <button 
            onClick={loadDatabaseData}
            className="btn-primary flex items-center bg-purple-600 hover:bg-purple-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
            </svg>
            Load from Database
          </button>
          
          <button 
            onClick={handleClearSavedData}
            className="btn-secondary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear Local Storage
          </button>
          
          <button 
            onClick={handleResetToPreloadedData}
            className="btn-secondary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset to Default Dataset
          </button>
          
          <button 
            onClick={handleWipeDefaultDataset}
            className="btn-secondary flex items-center bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Wipe Default Dataset
          </button>
        </div>
      )}
      
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-center text-gray-700">Processing data, please wait...</p>
          </div>
        </div>
      )}
    </main>
  );
} 