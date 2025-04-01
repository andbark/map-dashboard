'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CSVUpload from '../components/CSVUpload';
import SchoolList from '../components/SchoolList';
import HubSpotIntegration from '../components/HubSpotIntegration';
import AdminTools from '../components/AdminTools';
import TabsContainer from '../components/TabsContainer';
import DataManager from '../components/DataManager';
// Re-enable Firebase imports
import { firestore } from '../utils/firebase';
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import { getAllSchools } from '../lib/database';

// MOCK DATA for testing without Firebase
const MOCK_SCHOOLS = [
  {
    id: 'mock1',
    name: 'Washington High School',
    district: 'Eastern District',
    address: '123 Main St',
    city: 'Washington',
    state: 'DC',
    zipCode: '20001',
    latitude: 38.8951,
    longitude: -77.0364
  },
  {
    id: 'mock2',
    name: 'Lincoln Elementary',
    district: 'Northern District',
    address: '456 Oak Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    latitude: 41.8781,
    longitude: -87.6298
  },
  {
    id: 'mock3',
    name: 'Roosevelt Middle School',
    district: 'Western District',
    address: '789 Pine Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101',
    latitude: 37.7749,
    longitude: -122.4194
  }
];

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

  /* === USING FIREBASE SIMPLE FETCH === */
  useEffect(() => {
    setDataLoading(true);
    console.log("Setting up Firestore data fetch...");

    // Check if firestore is available before using it
    if (!firestore) {
        console.error("Firestore is not initialized. Cannot fetch data.");
        setDataLoading(false); // Stop loading state
        return; // Exit effect
    }

    // Using a simple one-time fetch instead of a real-time listener
    const fetchSchools = async () => {
      try {
        console.log("Attempting to fetch schools data (no listener)...");
        const schoolsCollectionRef = collection(firestore, "schools");
        const q = query(schoolsCollectionRef);
        
        // Using getDocs directly for one-time fetch
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log("No schools found in database. Using backup mock data.");
          // Use mock data as fallback
          setSchools(MOCK_SCHOOLS);
        } else {
          console.log(`Firestore fetch successful: ${querySnapshot.size} schools`);
          const schoolsData = [];
          querySnapshot.forEach((doc) => {
            schoolsData.push({ ...doc.data(), id: doc.id });
          });
          setSchools(schoolsData);
        }
        setDataLoading(false);
      } catch (error) {
        console.error("Error in Firestore fetch:", error);
        console.log("Using backup mock data due to error.");
        // Use mock data as fallback
        setSchools(MOCK_SCHOOLS);
        setDataLoading(false);
      }
    };
    
    fetchSchools();
    
    // No cleanup needed for one-time fetch
    return () => {
      console.log("Component unmounting, no listener to clean up.");
    };
  }, []); // Empty dependency array remains correct

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

  // handleSchoolsDeleted without direct Firestore interaction
  const handleSchoolsDeleted = () => {
    setSchools([]); 
    setSelectedSchool(null);
    setViewport({ center: [39.8283, -98.5795], zoom: 4 });
    console.log("Local schools cleared after delete operation (Firestore interaction handled in component).");
  };

  // Function to test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      setOperationLoading(true);
      setMessage({ text: 'Testing Firebase connection...', type: 'info' });
      
      // Test reading from schools collection
      const schoolsCollectionRef = collection(firestore, "schools");
      const q = query(schoolsCollectionRef);
      const querySnapshot = await getDocs(q);
      
      setMessage({ 
        text: `Firebase connection successful! Found ${querySnapshot.size} schools in database.`, 
        type: 'success' 
      });
      setFirebaseTestResult({
        timestamp: new Date().toLocaleTimeString(),
        schoolCount: querySnapshot.size,
        success: true
      });
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
                  {/* Map receives empty schools array initially */}
                  <Map 
                    schools={schools} 
                    selectedSchool={selectedSchool}
                    onSchoolSelect={setSelectedSchool} 
                    viewport={viewport}
                    setViewport={setViewport} 
                  />
                </div>
                {/* SchoolList receives empty schools array and isLoading=false */}
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
            // CSVUpload might fail later if it tries to use firestore/storage
            content: <CSVUpload setLoading={setOperationLoading} />, 
          },
          {
            label: 'Data Management',
            // DataManager might fail if it uses firestore
            content: (
              <DataManager
                schools={schools} 
                onSchoolsDeleted={handleSchoolsDeleted} 
                isLoading={dataLoading || operationLoading} 
              />
            ),
          },
           // Other tabs might also fail if they use Firebase services
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
            label: 'HubSpot',
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