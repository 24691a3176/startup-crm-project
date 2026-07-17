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
              ? 'bg-gradient-to-br from-[#6B46C1] to-[#6B46C1] text-white shadow-md'
              : 'bg-surface/70 dark:bg-surface/70 backdrop-blur-sm text-text-muted border border-border hover:bg-surface-hover dark:bg-background hover:border-border-focus'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default memo(AnalyticsFilters);
