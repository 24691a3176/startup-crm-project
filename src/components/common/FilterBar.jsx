import React from 'react';

const FILTERS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter leads by status"
    >
      {FILTERS.map((filter) => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:border-gray-600 dark:hover:border-gray-500'
            }`}
          >
            {filter} <span className="ml-1.5 opacity-80 text-xs">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
