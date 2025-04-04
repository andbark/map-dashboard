'use client';

import { useState, useEffect } from 'react';

export default function SchoolList({ schools = [], onSelectSchool, selectedSchool }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState(schools);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = schools.filter(school => {
        return (
          (school.name && school.name.toLowerCase().includes(term)) ||
          (school.address && school.address.toLowerCase().includes(term)) ||
          (school.city && school.city.toLowerCase().includes(term)) ||
          (school.state && school.state.toLowerCase().includes(term)) ||
          (school.zip && school.zip.toLowerCase().includes(term)) ||
          (school.district && school.district.toLowerCase().includes(term))
        );
      });
      setFilteredSchools(filtered);
    }
  }, [searchTerm, schools]);
  
  if (schools.length === 0) {
    return (
      <div className="card">
        <h2 className="heading-2 mb-4">School List</h2>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-gray-600">No schools imported yet</p>
          <p className="text-sm text-gray-500 mt-1">Upload a CSV file to see your schools</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="heading-2">School List</h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900"
        >
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          )}
        </button>
      </div>
      
      {!collapsed && (
        <>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search schools..."
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} found
          </div>
          
          <div className="h-80 overflow-y-auto rounded-md border border-gray-200 bg-gray-50">
            {filteredSchools.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4 text-gray-500">
                No schools match your search
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredSchools.map((school, index) => (
                  <li 
                    key={`${school.name}-${index}`}
                    className={`px-4 py-3 cursor-pointer transition-colors
                      ${selectedSchool === school ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-100'}`}
                    onClick={() => onSelectSchool(school)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-600">{school.address}</p>
                        <p className="text-sm text-gray-600">{school.city}, {school.state} {school.zip}</p>
                        {school.district && <p className="text-xs text-gray-500 mt-1">District: {school.district}</p>}
                      </div>
                      {(!school.latitude || !school.longitude) && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Needs geocoding
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 