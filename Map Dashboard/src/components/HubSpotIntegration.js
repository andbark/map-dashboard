'use client';

import { useState } from 'react';

export default function HubSpotIntegration({ schools = [], onSchoolsLoaded, setLoading }) {
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFetchSchools = async () => {
    if (!apiKey) {
      setMessage({ text: 'Please enter your HubSpot API key', type: 'error' });
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setMessage({ text: 'Fetching schools from HubSpot...', type: 'info' });

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data - in a real app this would come from HubSpot API
      const hubspotSchools = [
        {
          name: 'HubSpot Academy Elementary',
          address: '123 Inbound Way',
          city: 'Cambridge',
          state: 'MA',
          zip: '02142',
          district: 'HubSpot District',
          latitude: '42.3736',
          longitude: '-71.1097'
        },
        {
          name: 'CRM Middle School',
          address: '456 Marketing Blvd',
          city: 'Cambridge',
          state: 'MA',
          zip: '02142',
          district: 'HubSpot District',
          latitude: '42.3770',
          longitude: '-71.1167'
        }
      ];
      
      onSchoolsLoaded(hubspotSchools);
      setLoading(false);
      setMessage({ text: 'Schools imported successfully from HubSpot!', type: 'success' });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }, 2000);
  };

  const handleExportToHubSpot = async () => {
    if (schools.length === 0) {
      setMessage({ text: 'No schools to export', type: 'error' });
      return;
    }

    if (!apiKey) {
      setMessage({ text: 'Please enter your HubSpot API key', type: 'error' });
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setMessage({ text: 'Exporting schools to HubSpot...', type: 'info' });

    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
      setMessage({ text: 'Schools exported successfully to HubSpot!', type: 'success' });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }, 2000);
  };

  return (
    <div className="card">
      <h2 className="heading-2 mb-4">HubSpot Integration</h2>
      
      {message.text && (
        <div className={`p-3 rounded-md mb-4 ${
          message.type === 'error' ? 'bg-red-50 text-red-800' :
          message.type === 'success' ? 'bg-green-50 text-green-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'error' && (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            {message.type === 'success' && (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            {message.type === 'info' && (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}
      
      {showApiInput && (
        <div className="mb-4">
          <label htmlFor="hubspot-api-key" className="block text-sm font-medium text-gray-700 mb-1">
            HubSpot API Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="hubspot-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your HubSpot API key"
            />
          </div>
        </div>
      )}
      
      <p className="text-gray-600 mb-4">
        Connect with HubSpot to import or export your school data.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={handleFetchSchools}
          className="btn-primary flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          Import from HubSpot
        </button>
        
        <button 
          onClick={handleExportToHubSpot} 
          className={`btn-secondary flex items-center justify-center ${schools.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={schools.length === 0}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Export to HubSpot
        </button>
        
        {!showApiInput && (
          <button 
            onClick={() => setShowApiInput(true)} 
            className="btn-secondary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            Set API Key
          </button>
        )}
      </div>
    </div>
  );
} 