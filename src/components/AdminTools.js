'use client';

import { useState } from 'react';
import { testFirebaseConnection } from '../utils/firebaseTest';

export default function AdminTools({ onSchoolsLoaded, setLoading }) {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // In a real app, use more secure authentication
  const correctPassword = 'admin123'; // This would never be hardcoded in a real app
  
  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (adminPassword === correctPassword) {
      setAuthenticated(true);
      setTestResult(null);
    } else {
      alert('Incorrect password');
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleImportToDB = async (schools) => {
    if (!schools || schools.length === 0) {
      alert('No schools to import');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schools }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to import schools to database');
      }
      
      const result = await response.json();
      alert(`Successfully imported ${result.schools.length} schools to the shared database!`);
    } catch (error) {
      console.error('Error importing schools to database:', error);
      alert('Failed to import schools to the database. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to delete ALL schools from the shared database? This cannot be undone and will affect all users.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/schools', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear database');
      }
      
      alert('Successfully cleared all schools from the shared database!');
    } catch (error) {
      console.error('Error clearing database:', error);
      alert('Failed to clear the database. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {!showAdminPanel ? (
        <button 
          onClick={() => setShowAdminPanel(true)}
          className="btn-secondary w-full"
        >
          Show Admin Panel
        </button>
      ) : (
        <div>
          {!authenticated ? (
            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  You are logged in as an administrator. You can now manage the shared school database.
                </p>
              </div>
              
              <div className="p-4 border border-indigo-100 rounded-md">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2">Firebase Connection Test</h3>
                <button
                  onClick={handleTestConnection}
                  className="btn-secondary w-full mb-2"
                >
                  Test Firebase Connection
                </button>
                {testResult && (
                  <div className={`mt-2 p-2 rounded text-sm ${
                    testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {testResult.message}
                    {testResult.error && (
                      <div className="mt-1 text-xs">
                        Error: {testResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 border border-indigo-100 rounded-md">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2">Import Current Schools to Database</h3>
                <p className="text-xs text-gray-600 mb-3">
                  This will save all currently loaded schools to the shared database that all users can access.
                </p>
                <button
                  onClick={() => handleImportToDB(onSchoolsLoaded)}
                  className="btn-primary w-full"
                >
                  Save Current Schools to Shared Database
                </button>
              </div>
              
              <div className="p-4 border border-red-100 rounded-md">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-xs text-red-600 mb-3">
                  These actions are destructive and will affect all users of the application.
                </p>
                <button
                  onClick={handleClearDatabase}
                  className="btn-secondary bg-red-100 hover:bg-red-200 text-red-700 border-red-200 w-full"
                >
                  Clear Entire Database
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => {
              setShowAdminPanel(false);
              setAuthenticated(false);
              setAdminPassword('');
              setTestResult(null);
            }}
            className="btn-secondary mt-4 w-full"
          >
            Hide Admin Panel
          </button>
        </div>
      )}
    </div>
  );
} 