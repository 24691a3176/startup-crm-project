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
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              isActive
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'bg-surface dark:bg-surface-hover text-text-muted hover:bg-surface-hover border border-border dark:border-border-focus hover:border-border-focus dark:hover:border-border-focus'
            }`}
          >
            {filter} <span className="ml-1.5 opacity-80 text-xs">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
