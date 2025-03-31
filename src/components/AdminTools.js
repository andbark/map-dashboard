'use client';

import { useState } from 'react';

export default function AdminTools({ onSchoolsLoaded, setLoading }) {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  // In a real app, use more secure authentication
  const correctPassword = 'admin123'; // This would never be hardcoded in a real app
  
  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (adminPassword === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
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
            <form onSubmit={handleAuthenticate} className="mb-4">
              <div className="mb-3">
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Login as Admin
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