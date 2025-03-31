import { useState } from 'react';
import { fetchSchoolsFromHubSpot, importSchoolsToHubSpot } from '@/utils/hubspot';
import { School } from '@/types';

interface HubSpotIntegrationProps {
  schools: School[];
  onSchoolsLoaded: (schools: School[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function HubSpotIntegration({ 
  schools, 
  onSchoolsLoaded, 
  setLoading 
}: HubSpotIntegrationProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Fetch schools from HubSpot
  const handleFetchFromHubSpot = async () => {
    if (!apiKey) {
      setMessage({ text: 'Please enter your HubSpot API key', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: 'Fetching schools from HubSpot...', type: 'info' });
      
      const hubspotSchools = await fetchSchoolsFromHubSpot(apiKey);
      
      if (hubspotSchools.length === 0) {
        setMessage({ text: 'No schools found in HubSpot', type: 'info' });
      } else {
        onSchoolsLoaded(hubspotSchools);
        setMessage({ 
          text: `Successfully imported ${hubspotSchools.length} schools from HubSpot`, 
          type: 'success' 
        });
        // Hide API key input after successful fetch
        setShowApiInput(false);
      }
    } catch (error) {
      setMessage({ 
        text: `Error fetching from HubSpot: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Import current schools to HubSpot
  const handleExportToHubSpot = async () => {
    if (!apiKey) {
      setMessage({ text: 'Please enter your HubSpot API key', type: 'error' });
      return;
    }
    
    if (schools.length === 0) {
      setMessage({ text: 'No schools to export', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: 'Exporting schools to HubSpot...', type: 'info' });
      
      const success = await importSchoolsToHubSpot(apiKey, schools);
      
      if (success) {
        setMessage({ 
          text: `Successfully exported ${schools.length} schools to HubSpot`, 
          type: 'success' 
        });
        // Hide API key input after successful export
        setShowApiInput(false);
      } else {
        setMessage({ text: 'Failed to export schools to HubSpot', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: `Error exporting to HubSpot: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <button
          className={`text-sm inline-flex items-center px-4 py-2 rounded-md transition-colors ${
            showApiInput 
              ? 'text-indigo-800 bg-indigo-50' 
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
          onClick={() => setShowApiInput(!showApiInput)}
        >
          {showApiInput ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide API Configuration
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure HubSpot
            </>
          )}
        </button>
      </div>
      
      {showApiInput && (
        <div className="mb-6 p-5 rounded-lg bg-gray-50 border border-gray-200">
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              HubSpot API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              placeholder="Enter your HubSpot API key"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your API key is never stored on our servers and is only used for direct API calls.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  HubSpot integration allows you to sync your school data between this dashboard and your HubSpot CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div 
          className={`p-4 rounded-md mb-4 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : message.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : message.type === 'error' ? (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm">{message.text}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setMessage(null)}
                  className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFetchFromHubSpot}
          className="btn-primary inline-flex items-center"
          disabled={!apiKey}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Import from HubSpot
        </button>
        
        <button
          onClick={handleExportToHubSpot}
          className="btn-secondary inline-flex items-center text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          disabled={!apiKey || schools.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          Export to HubSpot
        </button>
      </div>
    </div>
  );
} 