'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';
import AdminTools from '../components/AdminTools';
import TabsContainer from '../components/TabsContainer';
import DataManager from '../components/DataManager';
import { saveSchools, getAllSchools, deleteAllSchools } from '../lib/database';

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
  const [dataLoading, setDataLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });

  // Load schools from database in background without blocking UI
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await getAllSchools();
        if (result.success) {
          setSchools(result.schools);
          setViewportToSchools(result.schools);
          if (result.schools.length > 0) {
            setMessage({ text: `Loaded ${result.schools.length} schools`, type: 'success' });
          }
        } else {
          console.error('Error loading schools:', result.error);
          setMessage({ text: 'Error loading schools. You can still use the app, but data may not be available.', type: 'warning' });
        }
      } catch (error) {
        console.error('Error in initial data loading:', error);
        setMessage({ text: 'Error loading schools. You can still use the app, but data may not be available.', type: 'warning' });
        setSchools([]);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const setViewportToSchools = (schools) => {
    const schoolsWithCoords = schools.filter(s => 
      s.latitude && 
      s.longitude && 
      !isNaN(parseFloat(s.latitude)) && 
      !isNaN(parseFloat(s.longitude))
    );
    
    console.log(`Schools with valid coordinates for map view: ${schoolsWithCoords.length} of ${schools.length}`);
    
    if (schoolsWithCoords.length > 0) {
      // Calculate bounds for all schools with coordinates
      if (schoolsWithCoords.length === 1) {
        // Just center on the single school
        setViewport({
          center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
          zoom: 13
        });
      } else {
        // For multiple schools, try to show all of them
        setViewport({
          center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
          zoom: 10 // A bit zoomed out to show multiple schools
        });
      }
    }
  };

  const handleSchoolsLoaded = async (newSchools) => {
    setOperationLoading(true);
    setMessage({ text: 'Processing schools...', type: 'info' });
    
    console.log(`Processing ${newSchools.length} schools`);
    console.log('School data sample:', newSchools.slice(0, 2));
    
    // Validate that schools have required data
    const validSchools = newSchools.filter(school => 
      school && 
      school.name && 
      school.address && 
      school.city && 
      school.state
    );
    
    if (validSchools.length !== newSchools.length) {
      console.warn(`Filtered out ${newSchools.length - validSchools.length} invalid schools`);
    }
    
    if (validSchools.length === 0) {
      setMessage({ text: 'No valid schools found to display', type: 'error' });
      setOperationLoading(false);
      return;
    }

    // Ensure schools have proper data types for coordinates
    const processedSchools = validSchools.map(school => ({
      ...school,
      latitude: school.latitude ? parseFloat(school.latitude) : undefined,
      longitude: school.longitude ? parseFloat(school.longitude) : undefined
    }));
    
    // Update state to display the schools on the map immediately
    setSchools(processedSchools);
    setSelectedSchool(null);
    setViewportToSchools(processedSchools);
    
    // Then try to save to Firebase (this happens in background)
    setMessage({ text: 'Saving schools to database...', type: 'info' });
    
    try {
      const result = await saveSchools(processedSchools);
      if (result.success) {
        setMessage({ 
          text: `Successfully imported ${processedSchools.length} schools! ${
            processedSchools.filter(s => s.latitude && s.longitude).length} schools have map coordinates.`, 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: `Warning: Schools are displayed but could not be saved to database: ${result.error || 'Unknown error'}`, 
          type: 'warning' 
        });
        console.error('Error saving schools:', result.error);
      }
    } catch (error) {
      // Keep schools in state even if saving fails
      console.error('Error saving schools:', error);
      setMessage({ 
        text: `Warning: Schools are displayed but could not be saved to database: ${error.message || 'Unknown error'}`, 
        type: 'warning' 
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSchoolsDeleted = async () => {
    if (!window.confirm('Are you sure you want to delete all schools? This action cannot be undone.')) {
      return;
    }

    setOperationLoading(true);
    setMessage({ text: 'Deleting schools...', type: 'info' });
    try {
      const result = await deleteAllSchools();
      if (result.success) {
        setSchools([]);
        setSelectedSchool(null);
        setViewport({
          center: [39.8283, -98.5795],
          zoom: 4
        });
        setMessage({ text: 'Successfully deleted all schools', type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete schools', type: 'error' });
        console.error('Error deleting schools:', result.error);
      }
    } catch (error) {
      setMessage({ text: 'Failed to delete schools', type: 'error' });
      console.error('Error deleting schools:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  // Skeleton loader for schools list
  const SchoolsListSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          message.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message.text}
          {message.type === 'warning' && 
            <button 
              className="ml-2 text-sm underline" 
              onClick={() => setMessage(null)}
            >
              Dismiss
            </button>
          }
        </div>
      )}
      
      {/* Initial loading indicator - non-blocking */}
      {dataLoading && (
        <div className="mb-4 bg-blue-50 p-3 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-blue-700">Loading school data...</span>
        </div>
      )}
      
      <TabsContainer
        tabs={[
          {
            label: 'Map View',
            content: (
              <div className="space-y-6">
                <div className="relative">
                  <Map
                    schools={schools}
                    selectedSchool={selectedSchool}
                    onSchoolSelect={setSelectedSchool}
                    viewport={viewport}
                    onViewportChange={setViewport}
                  />
                </div>
                
                {dataLoading ? (
                  <SchoolsListSkeleton />
                ) : (
                  <SchoolList
                    schools={schools}
                    selectedSchool={selectedSchool}
                    onSchoolSelect={setSelectedSchool}
                  />
                )}
              </div>
            ),
          },
          {
            label: 'Upload CSV',
            content: (
              <CSVUpload
                onSchoolsLoaded={handleSchoolsLoaded}
                setLoading={setOperationLoading}
              />
            ),
          },
          {
            label: 'Data Management',
            content: (
              <DataManager
                schools={schools}
                onSchoolsLoaded={handleSchoolsLoaded}
                onSchoolsDeleted={handleSchoolsDeleted}
                isLoading={dataLoading}
              />
            ),
          },
          {
            label: 'HubSpot Integration',
            content: <HubSpotIntegration schools={schools} onSchoolsLoaded={handleSchoolsLoaded} setLoading={setOperationLoading} />,
          },
          {
            label: 'Admin Tools',
            content: <AdminTools onSchoolsDeleted={handleSchoolsDeleted} />,
          },
        ]}
      />
      
      {/* Operation Loading Overlay - only shown for user-initiated operations */}
      {operationLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 30 }}>
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