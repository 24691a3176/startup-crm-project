import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @file ThemeContext.jsx
 * @description Context API layer for light / dark mode theming.
 */

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_theme');
      if (stored) return stored === 'dark';
      return false; // Default: false (light mode)
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('crm_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore write errors
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    // Add transition class for smooth color change
    root.classList.add('theme-transition');

    setIsDarkMode((prev) => !prev);

    // Remove transition class after animation completes to avoid
    // interfering with other transitions
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be called inside a ThemeProvider');
  }
  return ctx;
}
