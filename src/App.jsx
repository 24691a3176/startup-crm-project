// Import BrowserRouter from react-router-dom to wrap and enable web-history router functionality
import { BrowserRouter } from 'react-router-dom';
// Import our centralized routes file that holds the route tree map
import AppRoutes from './routes';

// Define the root App component that wraps the layout in routing context
function App() {
  return (
    // Wrap the entire application routing context in BrowserRouter
    <BrowserRouter>
      {/* Render the centralized routes tree containing matching pages and templates */}
      <AppRoutes />
    </BrowserRouter>
  );
}

// Export the App component as the main entry point to be rendered in main.jsx
export default App;
