import React, { memo } from 'react';

const filters = [
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last30', label: 'Last 30 Days' },
  { key: 'last90', label: 'Last 90 Days' },
  { key: 'thisYear', label: 'This Year' },
  { key: 'all', label: 'All Time' },
];

const AnalyticsFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeFilter === f.key
              ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-md'
              : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 hover:border-slate-300 dark:border-gray-600'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default memo(AnalyticsFilters);
