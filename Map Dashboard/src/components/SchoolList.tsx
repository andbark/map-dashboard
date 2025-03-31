import { useState } from 'react';
import { School } from '@/types';

interface SchoolListProps {
  schools: School[];
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export default function SchoolList({ 
  schools, 
  selectedSchool, 
  setSelectedSchool,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed
}: SchoolListProps) {
  // Use internal state if no external state is provided
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use either external or internal state
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

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
  
  const schoolCount = filteredSchools.length;
  const geocodingPendingCount = filteredSchools.filter(school => 
    !school.latitude || !school.longitude
  ).length;
  
  return (
    <div className="h-full overflow-hidden bg-white rounded-lg shadow border border-gray-200 flex flex-col">
      <div 
        className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div>
          <h2 className="font-bold text-gray-900">{isCollapsed ? 'Schools' : `Schools (${schools.length})`}</h2>
          {!isCollapsed && geocodingPendingCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {geocodingPendingCount} pending geocoding
            </p>
          )}
        </div>
        <button 
          className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          aria-label={isCollapsed ? "Expand school list" : "Collapse school list"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <>
          {schools.length > 0 && (
            <div className="p-3">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-3 top-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-xs text-gray-500">
                  Found {schoolCount} {schoolCount === 1 ? 'school' : 'schools'} matching "{searchQuery}"
                </p>
              )}
            </div>
          )}
          
          <div className="overflow-auto flex-grow">
            {schools.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">No schools imported yet</p>
                <p className="text-sm text-gray-500 mt-1">Upload a CSV file to get started</p>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">No schools match your search</p>
                <button 
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <ul className="p-2">
                {filteredSchools.map((school) => (
                  <li 
                    key={school.id || `${school.name}-${school.address}`}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-md my-1 ${
                      selectedSchool && selectedSchool.name === school.name && 
                      selectedSchool.address === school.address 
                        ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                        : ''
                    }`}
                    onClick={() => setSelectedSchool(school)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-500">{school.district}</p>
                      </div>
                      {(!school.latitude || !school.longitude) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm">
                      <p className="text-gray-700">{school.address}</p>
                      <p className="text-gray-700">{school.city}, {school.state} {school.zipCode}</p>
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