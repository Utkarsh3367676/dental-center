import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { authState, loading } = useAuth();

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected component
  return element;
};

export default ProtectedRoute;
