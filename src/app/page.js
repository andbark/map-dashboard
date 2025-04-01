'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';
import AdminTools from '../components/AdminTools';
import TabsContainer from '../components/TabsContainer';
import DataManager from '../components/DataManager';
import { firestore } from '../utils/firebase';
import { collection, onSnapshot, query } from "firebase/firestore";

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
  const [firebaseTestResult, setFirebaseTestResult] = useState(null);
  const [viewport, setViewport] = useState({
    center: [39.8283, -98.5795], // Center of US
    zoom: 4
  });
  const [activeTab, setActiveTab] = useState('Map View');

  // Effect to fetch schools from Firestore in real-time
  useEffect(() => {
    setDataLoading(true);
    console.log("Setting up Firestore listener for schools...");

    const schoolsCollectionRef = collection(firestore, "schools");
    
    // Temporarily remove orderBy to simplify the query for debugging
    // const q = query(schoolsCollectionRef, orderBy("name")); 
    const q = query(schoolsCollectionRef); // Simple query for the whole collection

    // onSnapshot listens for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`Firestore snapshot received: ${querySnapshot.size} schools`);
      const schoolsData = [];
      querySnapshot.forEach((doc) => {
        schoolsData.push({ ...doc.data(), id: doc.id }); // Add document ID to school data
      });
      setSchools(schoolsData);
      setDataLoading(false);
      console.log("Schools state updated from Firestore.");
      // Optional: Adjust viewport after initial data load
      // if (schoolsData.length > 0 && viewport.zoom === 4) { // Only adjust if on initial default zoom
      //   setViewportToSchools(schoolsData); 
      // }
    }, (error) => {
      console.error("Error fetching schools from Firestore: ", error);
      // Handle error appropriately, maybe show a message to the user
      setDataLoading(false);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      console.log("Cleaning up Firestore listener.");
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const setViewportToSchools = (schoolsList) => {
    const schoolsWithCoords = schoolsList.filter(s => 
      s.latitude && s.longitude && 
      !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude))
    );
    
    if (schoolsWithCoords.length === 1) {
      setViewport({
        center: [parseFloat(schoolsWithCoords[0].latitude), parseFloat(schoolsWithCoords[0].longitude)],
        zoom: 13
      });
    } else if (schoolsWithCoords.length > 1) {
       // Basic centering logic - could use library like leaflet-bounds for better fit
       const avgLat = schoolsWithCoords.reduce((sum, s) => sum + parseFloat(s.latitude), 0) / schoolsWithCoords.length;
       const avgLng = schoolsWithCoords.reduce((sum, s) => sum + parseFloat(s.longitude), 0) / schoolsWithCoords.length;
       setViewport({
        center: [avgLat, avgLng],
        zoom: 6 // Adjust zoom level as needed to fit schools
      });
    }
    // else keep default viewport if no schools have coordinates
  };

  const handleSchoolsDeleted = () => {
    setSchools([]); // Clear schools locally immediately, Firestore listener will update if needed
    setSelectedSchool(null);
    // Reset viewport or handle as needed
    setViewport({
      center: [39.8283, -98.5795],
      zoom: 4
    });
    console.log("Local schools cleared after delete operation.");
  };

  // Function to test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      setOperationLoading(true);
      setMessage({ text: 'Testing Firebase connection...', type: 'info' });
      
      // Test reading from schools collection
      const result = await getAllSchools();
      
      if (result.success) {
        setMessage({ 
          text: `Firebase connection successful! Found ${result.schools.length} schools in database.`, 
          type: 'success' 
        });
        setFirebaseTestResult({
          timestamp: new Date().toLocaleTimeString(),
          schoolCount: result.schools.length,
          success: true
        });
      } else {
        setMessage({ 
          text: `Firebase connection failed: ${result.error || 'Unknown error'}`, 
          type: 'error' 
        });
        setFirebaseTestResult({
          timestamp: new Date().toLocaleTimeString(),
          error: result.error,
          success: false
        });
      }
    } catch (error) {
      console.error('Firebase test error:', error);
      setMessage({ 
        text: `Firebase connection failed: ${error.message || 'Unknown error'}`, 
        type: 'error' 
      });
      setFirebaseTestResult({
        timestamp: new Date().toLocaleTimeString(),
        error: error.message,
        success: false
      });
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
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="heading-1 mb-6">School Photography Dashboard</h1>
      
      <TabsContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
                    setViewport={setViewport}
                  />
                </div>
                
                <SchoolList
                  schools={schools}
                  selectedSchool={selectedSchool}
                  onSelectSchool={setSelectedSchool}
                  isLoading={dataLoading}
                />
              </div>
            ),
          },
          {
            label: 'Upload CSV',
            content: (
              <CSVUpload setLoading={setOperationLoading} />
            ),
          },
          {
            label: 'Data Management',
            content: (
              <DataManager
                schools={schools} 
                onSchoolsDeleted={handleSchoolsDeleted}
                isLoading={dataLoading || operationLoading}
              />
            ),
          },
          {
            label: 'Firebase Test',
            content: (
              <div className="card p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Firebase Connection Test</h2>
                  <button
                    onClick={testFirebaseConnection}
                    className="btn-primary text-sm py-1 px-3"
                    disabled={operationLoading}
                  >
                    Test Connection
                  </button>
                </div>
                
                {firebaseTestResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    firebaseTestResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <p><strong>Time:</strong> {firebaseTestResult.timestamp}</p>
                    {firebaseTestResult.success ? (
                      <p><strong>Result:</strong> Connected successfully! Found {firebaseTestResult.schoolCount} schools.</p>
                    ) : (
                      <p><strong>Error:</strong> {firebaseTestResult.error || 'Unknown error'}</p>
                    )}
                  </div>
                )}
              </div>
            ),
          },
          {
            label: 'HubSpot Integration',
            content: <HubSpotIntegration schools={schools} setLoading={setOperationLoading} />,
          },
          {
            label: 'Admin Tools',
            content: <AdminTools setLoading={setOperationLoading} />,
          },
        ]}
      />
      
      {/* Loading Overlay for Operations like CSV upload/delete */}
      {operationLoading && (
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