import api, { withRetry } from './api';

export const authService = {
  /**
   * Register a new user account.
   * Uses withRetry to handle transient server errors during registration.
   */
  register: async (name, email, password) => {
    const response = await withRetry(() =>
      api.post('/api/auth/register', { name, email, password })
    );
    return response.data;
  },
  
  /**
   * Login with email and password.
   * Uses withRetry to handle transient server errors during login.
   */
  login: async (email, password) => {
    const response = await withRetry(() =>
      api.post('/api/auth/login', { email, password })
    );
    return response.data;
  },
  
  /**
   * Logout — removes the JWT token from sessionStorage.
   * The backend is stateless (JWT-based), so no server call is needed.
   */
  logout: () => {
    sessionStorage.removeItem('crm-token');
  },
  
  /**
   * Fetch the current user's profile.
   * Used to restore sessions from a stored token.
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
  
  /**
   * Update the current user's profile (name and/or password).
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};
