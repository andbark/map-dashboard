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
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });

  // Load schools from database on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      try {
        const result = await getAllSchools();
        if (result.success) {
          setSchools(result.schools);
          setViewportToSchools(result.schools);
        } else {
          console.error('Error loading schools:', result.error);
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
    try {
      const result = await saveSchools(newSchools);
      if (result.success) {
        setSchools(newSchools);
        setSelectedSchool(null);
        setViewportToSchools(newSchools);
      } else {
        console.error('Error saving schools:', result.error);
        alert('Failed to save schools to database');
      }
    } catch (error) {
      console.error('Error saving schools:', error);
      alert('Failed to save schools to database');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolsDeleted = async () => {
    if (confirm('Are you sure you want to delete all schools? This cannot be undone.')) {
      setLoading(true);
      try {
        const result = await deleteAllSchools();
        if (result.success) {
          setSchools([]);
          setSelectedSchool(null);
          setViewport({
            center: [39.8283, -98.5795],
            zoom: 4
          });
        } else {
          console.error('Error deleting schools:', result.error);
          alert('Failed to delete schools from database');
        }
      } catch (error) {
        console.error('Error deleting schools:', error);
        alert('Failed to delete schools from database');
      } finally {
        setLoading(false);
      }
    }
  };

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
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert('Failed to upload CSV file');
                }}
              />
            ),
          },
          {
            label: 'Data Management',
            content: <DataManager />,
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