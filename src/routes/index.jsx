// Import React to enable React features like lazy loading and Suspense
import React, { Suspense } from 'react';
// Import routing components from react-router-dom for defining page routes
import { Routes, Route } from 'react-router-dom';
// Import the Layout component that will wrap our pages and render the Sidebar
import Layout from '../components/common/Layout';

// Lazily load the Dashboard component to reduce initial bundle size and load time
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
// Lazily load the Leads component so it's only fetched when the user navigates to /leads
const Leads = React.lazy(() => import('../pages/Leads'));
// Lazily load the Analytics component to implement code splitting for analytics reporting
const Analytics = React.lazy(() => import('../pages/Analytics'));

// Lazily load the NotFound component to handle unknown routes dynamically
const NotFound = React.lazy(() => import('../pages/NotFound'));

// A Loading component to show a premium fallback spinner while lazy pages are loading
const PageLoader = () => (
  // Visual outer container centered on screen with padding
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    {/* Animated spinner ring with gradient effects */}
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    {/* Supporting loading helper text */}
    <p className="text-text-gray font-roboto text-sm animate-pulse">Loading CRM modules...</p>
  </div>
);

// Define and export the main AppRoutes component
export default function AppRoutes() {
  return (
    // Wrap the entire nested route tree inside the Routes container
    <Routes>
      {/* Route matching the root URL that renders our shared Layout component */}
      <Route path="/" element={<Layout />}>
        {/* Index route for the Dashboard component, loaded when path is exactly "/" */}
        <Route
          index
          element={
            // Wrap in Suspense to render PageLoader while Dashboard chunk is fetched
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        {/* Route for Lead Management at path "/leads" */}
        <Route
          path="leads"
          element={
            // Wrap in Suspense to render PageLoader while Leads chunk is fetched
            <Suspense fallback={<PageLoader />}>
              <Leads />
            </Suspense>
          }
        />
        {/* Route for adding a new lead at path "/leads/new" */}
        <Route
          path="leads/new"
          element={
            <Suspense fallback={<PageLoader />}>
              <Leads />
            </Suspense>
          }
        />
        {/* Route for Analytics reports at path "/analytics" */}
        <Route
          path="analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <Analytics />
            </Suspense>
          }
        />

        {/* Catch-all route (*) that renders the 404 page for unknown URLs */}
        <Route
          path="*"
          element={
            // Wrap in Suspense to render PageLoader while NotFound chunk is fetched
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
