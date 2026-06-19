import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LeadProvider }  from './context/LeadContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

/**
 * Provider order (outermost → innermost):
 *   LeadProvider   – owns the leads array + CRUD; available to ALL children
 *   ThemeProvider  – owns dark/light mode; can consume leads if ever needed
 *   App            – routing root
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LeadProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LeadProvider>
  </StrictMode>,
);
