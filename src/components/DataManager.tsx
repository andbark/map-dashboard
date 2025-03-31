import React, { useState } from 'react';

interface School {
  id?: string;
  name: string;
  district: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface DataManagerProps {
  schools: School[];
  onSchoolsLoaded: (schools: School[]) => void;
  onSchoolsDeleted: () => void;
}

export default function DataManager({ schools, onSchoolsLoaded, onSchoolsDeleted }: DataManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter schools based on search query
  const filteredSchools = searchQuery.trim() === '' 
    ? schools 
    : schools.filter(school => {
        const query = searchQuery.toLowerCase();
        return (
          school.name.toLowerCase().includes(query) ||
          school.district.toLowerCase().includes(query) ||
          school.address.toLowerCase().includes(query) ||
          school.city.toLowerCase().includes(query) ||
          school.state.toLowerCase().includes(query) ||
          school.zipCode.toLowerCase().includes(query)
        );
      });

  // Sort schools
  const sortedSchools = [...filteredSchools].sort((a, b) => {
    const aValue = a[sortField as keyof School];
    const bValue = b[sortField as keyof School];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: keyof School) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all schools? This action cannot be undone.')) {
      onSchoolsDeleted();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Data Management</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete All Schools
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search schools..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['name', 'district', 'address', 'city', 'state', 'zipCode', 'latitude', 'longitude'].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field as keyof School)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (
                        <svg
                          className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSchools.map((school, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.zipCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.latitude ? school.latitude.toFixed(6) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.longitude ? school.longitude.toFixed(6) : '-'}
                  </td>
                </tr>
              ))}
              {sortedSchools.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No schools found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Showing {sortedSchools.length} of {schools.length} schools
      </div>
    </div>
  );
} 