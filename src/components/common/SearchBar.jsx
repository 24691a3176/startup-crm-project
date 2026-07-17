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
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-subtle pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="leads-search"
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-11 pr-10 py-2.5 rounded-xl text-sm bg-surface dark:bg-surface-hover border border-border dark:border-border-focus hover:border-border-focus dark:hover:border-border-focus focus:border-primary dark:focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-subtle dark:placeholder-text-subtle text-text-main transition-all duration-200 shadow-sm dark:shadow-none"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-main dark:hover:text-text-main transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
