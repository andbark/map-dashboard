'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';
import AdminTools from '../components/AdminTools';
import TabsContainer from '../components/TabsContainer';
import Login from '../components/Login';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, loading: authLoading } = useAuth();
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
      if (!user) return; // Don't load data if not authenticated
      
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
  }, [user]);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <main className="container-custom py-8">
      <TabsContainer
        tabs={[
          {
            label: 'Map View',
            content: (
              <div className="space-y-6">
                <Map
                  schools={schools}
                  selectedSchool={selectedSchool}
                  onSchoolSelect={setSelectedSchool}
                  viewport={viewport}
                  onViewportChange={setViewport}
                />
                <SchoolList
                  schools={schools}
                  selectedSchool={selectedSchool}
                  onSchoolSelect={setSelectedSchool}
                />
              </div>
            ),
          },
          {
            label: 'Upload CSV',
            content: (
              <CSVUpload
                onSchoolsUploaded={handleSchoolsLoaded}
                onUploadError={handleUploadError}
              />
            ),
          },
          {
            label: 'HubSpot Integration',
            content: <HubSpotIntegration schools={schools} />,
          },
          {
            label: 'Admin Tools',
            content: <AdminTools onSchoolsDeleted={handleSchoolsDeleted} />,
          },
        ]}
      />
    </main>
  );
} 