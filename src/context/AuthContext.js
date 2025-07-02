import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthState, initializeAuth, logout as authLogout } from '../services/auth';
import { initializeData } from '../services/data';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data
    initializeAuth();
    initializeData();
    
    // Get auth state from localStorage
    const currentAuthState = getAuthState();
    setAuthState(currentAuthState);
    setLoading(false);
  }, []);
  
  // Logout function
  const logout = () => {
    const logoutState = authLogout();
    setAuthState(logoutState);
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
