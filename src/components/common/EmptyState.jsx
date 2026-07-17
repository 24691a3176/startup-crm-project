import React from 'react';
import { UserPlus, SearchX } from 'lucide-react';

export default function EmptyState({ totalLeads = 0, onClearFilters }) {
  const isAbsolutelyEmpty = totalLeads === 0;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 gap-4 text-center animate-in fade-in duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${isAbsolutelyEmpty ? 'bg-primary/10 dark:bg-primary/20' : 'bg-surface-hover'}`}>
        {isAbsolutelyEmpty ? (
          <UserPlus className="w-8 h-8 text-primary dark:text-primary" />
        ) : (
          <SearchX className="w-8 h-8 text-text-subtle" />
        )}
      </div>

      <div className="space-y-2 max-w-sm">
        <p className="font-bold text-text-main dark:text-white text-lg">
          {isAbsolutelyEmpty ? 'No leads yet' : 'No leads found'}
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          {isAbsolutelyEmpty
            ? 'Add your first lead to start building your pipeline.'
            : 'No leads match your current search or filter. Try adjusting your criteria.'}
        </p>
      </div>

      {!isAbsolutelyEmpty && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-primary bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/30 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
