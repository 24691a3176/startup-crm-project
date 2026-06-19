import React from 'react';
import { UserPlus, SearchX } from 'lucide-react';

export default function EmptyState({ totalLeads = 0, onClearFilters }) {
  const isAbsolutelyEmpty = totalLeads === 0;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 gap-4 text-center animate-in fade-in duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${isAbsolutelyEmpty ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-gray-700'}`}>
        {isAbsolutelyEmpty ? (
          <UserPlus className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        ) : (
          <SearchX className="w-8 h-8 text-slate-400 dark:text-gray-500" />
        )}
      </div>

      <div className="space-y-2 max-w-sm">
        <p className="font-bold text-slate-800 dark:text-white text-lg">
          {isAbsolutelyEmpty ? 'No leads yet' : 'No leads found'}
        </p>
        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
          {isAbsolutelyEmpty
            ? 'Add your first lead to start building your pipeline.'
            : 'No leads match your current search or filter. Try adjusting your criteria.'}
        </p>
      </div>

      {!isAbsolutelyEmpty && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
