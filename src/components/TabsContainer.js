'use client';

import { useState } from 'react';

export default function TabsContainer({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mb-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-3 px-6 font-medium text-sm focus:outline-none transition-colors relative ${
              activeTab === index
                ? 'tab-active z-10'
                : 'tab-inactive'
            }`}
            onClick={() => setActiveTab(index)}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-px">
        {tabs[activeTab].content}
      </div>
    </div>
  );
} 