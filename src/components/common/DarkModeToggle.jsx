import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * An animated toggle switch for switching between light and dark modes.
 * Shows a sun icon (light mode) and moon icon (dark mode) with smooth transitions.
 *
 * @returns {JSX.Element} The rendered DarkModeToggle component.
 */
export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 bg-slate-200 dark:bg-slate-700"
    >
      {/* Sun icon (left side) */}
      <Sun
        className={`absolute left-1.5 w-4 h-4 transition-all duration-300 ${
          isDarkMode ? 'text-slate-500 dark:text-gray-400 opacity-50' : 'text-amber-500 opacity-100'
        }`}
      />

      {/* Moon icon (right side) */}
      <Moon
        className={`absolute right-1.5 w-4 h-4 transition-all duration-300 ${
          isDarkMode ? 'text-blue-300 opacity-100' : 'text-slate-400 opacity-50'
        }`}
      />

      {/* Sliding toggle knob */}
      <span
        className={`absolute w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? 'translate-x-8' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
