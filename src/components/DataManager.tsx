import React, { useState, useEffect } from 'react';
import { importData, fetchAllData, deleteAllData } from '../lib/dataManager';

interface MapData {
  id?: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

export default function DataManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchAllData();
    if (result.success) {
      setData(result.data);
    } else {
      setMessage('Failed to load data');
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const result = await importData(jsonData);
      
      if (result.success) {
        setMessage('Data imported successfully');
        loadData(); // Reload data after import
      } else {
        setMessage('Failed to import data');
      }
    } catch (error) {
      setMessage('Error processing file');
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all data?')) return;
    
    setLoading(true);
    const result = await deleteAllData();
    if (result.success) {
      setData([]);
      setMessage('All data deleted successfully');
    } else {
      setMessage('Failed to delete data');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Data Management</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Import Data (JSON file)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="mt-1 block w-full"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleDeleteAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Delete All Data
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Data</h3>
          {data.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div className="grid gap-4">
              {data.map((item: MapData) => (
                <div key={item.id} className="border p-4 rounded">
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Coordinates:</strong> {item.coordinates.lat}, {item.coordinates.lng}</p>
                  <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 