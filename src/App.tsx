import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientManagement from './pages/ClientManagement';
import ClientProfile from './pages/ClientProfile';
import DisputeManagement from './pages/DisputeManagement';
import Documents from './pages/Documents';
import Education from './pages/Education';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import ClientPortal from './pages/ClientPortal';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Admin and Specialist Routes */}
            <Route
              path="clients"
              element={
                <ProtectedRoute allowedRoles={['admin', 'specialist']}>
                  <ClientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="clients/:clientId"
              element={
                <ProtectedRoute allowedRoles={['admin', 'specialist']}>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="disputes"
              element={
                <ProtectedRoute allowedRoles={['admin', 'specialist']}>
                  <DisputeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'specialist']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="portal"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientPortal />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes */}
            <Route path="documents" element={<Documents />} />
            <Route path="education" element={<Education />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
