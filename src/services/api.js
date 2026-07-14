import axios from 'axios';

// ─── Base URL Configuration ─────────────────────────────────────────────────
// In development: use empty string so Vite's dev-server proxy handles /api/* forwarding.
// In production: VITE_API_URL must point to the deployed backend (e.g., https://api.yourapp.com).
const baseURL = import.meta.env.VITE_API_URL || '';

// ─── Create Axios Instance ──────────────────────────────────────────────────
const api = axios.create({
  baseURL,
  timeout: 15000, // 15-second timeout — prevents UI hanging on unresponsive servers
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Automatically attach the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Handle 401 (expired/invalid token) globally.
// NOTE: We intentionally do NOT show toast.error() here — callers handle their
// own error messages so we don't get double-toasts or toasts on pages the user isn't on.
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ✓ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log all errors in development
    if (import.meta.env.DEV) {
      if (error.response) {
        console.error(`[API] ✗ ${error.response.status} ${error.config?.url}:`, error.response.data?.message);
      } else if (error.code === 'ECONNABORTED') {
        console.error('[API] ✗ Request timeout');
      } else {
        console.error('[API] ✗ Network error — server unreachable');
      }
    }

    // Auto-redirect on 401 (but NOT on login/register pages — those handle 401 themselves)
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthEndpoint) {
        sessionStorage.removeItem('crm-token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Retry Wrapper ──────────────────────────────────────────────────────────
/**
 * Wraps an axios request with a single automatic retry on transient failures.
 * Only retries on: network errors, timeouts, and 5xx server errors.
 * Does NOT retry on 4xx client errors (bad input, unauthorized, etc.)
 *
 * @param {Function} requestFn - A function that returns an axios promise, e.g. () => api.post('/api/auth/login', data)
 * @param {number} retryDelay - Delay in ms before retrying (default: 1500ms)
 * @returns {Promise} The axios response
 */
export const withRetry = async (requestFn, retryDelay = 1500) => {
  try {
    return await requestFn();
  } catch (error) {
    const isRetryable =
      !error.response || // network error (server unreachable)
      error.code === 'ECONNABORTED' || // timeout
      (error.response?.status >= 500 && error.response?.status < 600); // server error

    if (isRetryable) {
      console.log(`[API] Retrying request in ${retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return requestFn(); // single retry — if this fails, the error propagates
    }

    throw error; // 4xx errors are not retried
  }
};

// ─── Health Check ───────────────────────────────────────────────────────────
/**
 * Checks if the backend server is available and the database is connected.
 *
 * @returns {Promise<{ ok: boolean, data?: object }>}
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health', { timeout: 5000 });
    return { ok: response.data?.status === 'OK', data: response.data };
  } catch {
    return { ok: false, data: null };
  }
};

// ─── Error Message Helper ───────────────────────────────────────────────────
/**
 * Extracts a human-readable error message from an axios error.
 * Distinguishes between server-offline, timeout, and backend-reported errors.
 *
 * @param {Error} error - Axios error object
 * @param {string} fallback - Default message if nothing better is available
 * @returns {string}
 */
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    return 'Cannot connect to server. Please check your connection.';
  }

  // Use the backend's error message if available
  const serverMessage = error.response.data?.message;

  switch (error.response.status) {
    case 401:
      return serverMessage || 'Invalid credentials';
    case 403:
      return serverMessage || 'Account is deactivated';
    case 404:
      return serverMessage || 'Resource not found';
    case 409:
      return serverMessage || 'Already exists';
    case 429:
      return 'Too many attempts. Please wait and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again.';
    default:
      return serverMessage || fallback;
  }
};

export default api;
