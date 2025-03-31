'use client';

import { useState } from 'react';

export default function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/create-admin', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Admin user created successfully! You can now log in with:\nEmail: admin@mapdashboard.com\nPassword: admin123456');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin User
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating...' : 'Create Admin User'}
            </button>
          </div>
          {message && (
            <div className="mt-4 p-4 rounded-md bg-white shadow">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{message}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 