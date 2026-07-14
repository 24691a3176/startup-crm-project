import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Leads = React.lazy(() => import('../pages/Leads'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-text-gray font-roboto text-sm animate-pulse">Loading CRM modules...</p>
  </div>
);

import { useLeads } from '../context/LeadContext';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();
  const { fetchLeads, leads } = useLeads();
  const [hasFetched, setHasFetched] = React.useState(false);
  
  React.useEffect(() => {
    if (token && !hasFetched) {
      fetchLeads();
      setHasFetched(true);
    }
  }, [token, fetchLeads, hasFetched]);
  
  if (isLoading) return <PageLoader />;
  if (!token) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      } />
      
      <Route path="/register" element={
        <Suspense fallback={<PageLoader />}>
          <Register />
        </Suspense>
      } />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="leads"
            element={
              <Suspense fallback={<PageLoader />}>
                <Leads />
              </Suspense>
            }
          />
          <Route
            path="leads/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <Leads />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<PageLoader />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
