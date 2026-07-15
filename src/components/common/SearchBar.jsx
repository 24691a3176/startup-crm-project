import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full md:w-96">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500 pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="leads-search"
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-11 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:border-gray-600 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 dark:placeholder:text-gray-500 text-slate-800 dark:text-gray-100 transition-all duration-200 shadow-sm dark:shadow-none"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
