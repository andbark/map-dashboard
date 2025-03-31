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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });

  // Load schools from database on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setMessage({ text: 'Loading schools...', type: 'info' });
      
      try {
        const result = await getAllSchools();
        if (result.success) {
          setSchools(result.schools);
          setViewportToSchools(result.schools);
          setMessage({ text: `Loaded ${result.schools.length} schools`, type: 'success' });
        } else {
          setMessage({ text: 'Error loading schools', type: 'error' });
          console.error('Error loading schools:', result.error);
        }
      } catch (error) {
        setMessage({ text: 'Error loading schools', type: 'error' });
        console.error('Error in initial data loading:', error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const setViewportToSchools = (schools) => {
    const schoolsWithCoords = schools.filter(s => s.latitude && s.longitude);
    if (schoolsWithCoords.length > 0) {
      setViewport({
        center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
        zoom: 10
      });
    }
  };

  const handleSchoolsLoaded = async (newSchools) => {
    setLoading(true);
    setMessage({ text: 'Saving schools...', type: 'info' });
    try {
      const result = await saveSchools(newSchools);
      if (result.success) {
        setSchools(newSchools);
        setSelectedSchool(null);
        setViewportToSchools(newSchools);
        setMessage({ text: `Successfully saved ${newSchools.length} schools`, type: 'success' });
      } else {
        setMessage({ text: 'Failed to save schools', type: 'error' });
        console.error('Error saving schools:', result.error);
        alert('Failed to save schools to database');
      }
    } catch (error) {
      setMessage({ text: 'Failed to save schools', type: 'error' });
      console.error('Error saving schools:', error);
      alert('Failed to save schools to database');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolsDeleted = async () => {
    if (!window.confirm('Are you sure you want to delete all schools? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
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
        alert('Failed to delete schools from database');
      }
    } catch (error) {
      setMessage({ text: 'Failed to delete schools', type: 'error' });
      console.error('Error deleting schools:', error);
      alert('Failed to delete schools from database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message.text}
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
                  {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-3"></div>
                        <p className="text-gray-500">Loading...</p>
                      </div>
                    </div>
                  )}
                </div>
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
                onSchoolsLoaded={handleSchoolsLoaded}
                setLoading={setLoading}
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
              />
            ),
          },
          {
            label: 'HubSpot Integration',
            content: <HubSpotIntegration schools={schools} onSchoolsLoaded={handleSchoolsLoaded} setLoading={setLoading} />,
          },
          {
            label: 'Admin Tools',
            content: <AdminTools onSchoolsDeleted={handleSchoolsDeleted} />,
          },
        ]}
      />
      
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