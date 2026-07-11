import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('crm-token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Guard against concurrent login/register calls
  const isAuthInProgress = useRef(false);

  // On mount: check sessionStorage for 'crm-token', if found call getProfile() to restore session
  useEffect(() => {
    // Ensure any legacy persistent tokens are removed
    localStorage.removeItem('crm-token');

    const restoreSession = async () => {
      const storedToken = sessionStorage.getItem('crm-token');
      if (storedToken) {
        try {
          console.log('[AuthContext] Restoring session from stored token...');
          const res = await authService.getProfile();
          // Backend returns user data inside res.data
          setUser(res.user || res.data || res);
          console.log('[AuthContext] Session restored successfully');
        } catch (error) {
          // Silently handle network errors during session restore — don't toast
          // If the token is truly invalid, the 401 interceptor in api.js will clear it
          console.warn('[AuthContext] Session restore failed:', error.message || error);

          // Only clear token if it was a 401 (invalid/expired token), not a network error
          if (error.response?.status === 401) {
            sessionStorage.removeItem('crm-token');
            setToken(null);
          }
          // For network errors: keep the token — user might just have a temporary connectivity issue
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    // Prevent duplicate concurrent login calls
    if (isAuthInProgress.current) {
      console.warn('[AuthContext] Login already in progress, ignoring duplicate call');
      return;
    }

    isAuthInProgress.current = true;
    try {
      const res = await authService.login(email, password);
      sessionStorage.setItem('crm-token', res.token);
      setToken(res.token);
      setUser(res.user || res.data || res);
      return res;
    } finally {
      isAuthInProgress.current = false;
    }
  };

  const register = async (name, email, password) => {
    // Prevent duplicate concurrent register calls
    if (isAuthInProgress.current) {
      console.warn('[AuthContext] Registration already in progress, ignoring duplicate call');
      return;
    }

    isAuthInProgress.current = true;
    try {
      const res = await authService.register(name, email, password);
      sessionStorage.setItem('crm-token', res.token);
      setToken(res.token);
      setUser(res.user || res.data || res);
      return res;
    } finally {
      isAuthInProgress.current = false;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export AuthContext, AuthProvider, useAuth custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
