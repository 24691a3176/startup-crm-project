import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkHealth, getErrorMessage } from '../services/api';
import { Mail, Lock, ArrowRight, Loader2, WifiOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const { login } = useAuth();
  const navigate = useNavigate();
  const retryTimerRef = useRef(null);

  // ─── Pre-login health check ────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const checkServer = async () => {
      const health = await checkHealth();
      if (isMounted) {
        setServerStatus(health.ok ? 'online' : 'offline');
        
        // If offline, auto-retry every 5 seconds
        if (!health.ok) {
          retryTimerRef.current = setTimeout(checkServer, 5000);
        }
      }
    };

    checkServer();

    return () => {
      isMounted = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // ─── Manual retry ──────────────────────────────────────────────────────
  const handleRetryConnection = async () => {
    setServerStatus('checking');
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    const health = await checkHealth();
    setServerStatus(health.ok ? 'online' : 'offline');
    if (health.ok) {
      toast.success('Server is back online!');
    } else {
      // Continue auto-retry
      retryTimerRef.current = setTimeout(handleRetryConnection, 5000);
    }
  };

  // ─── Form submission ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guard: don't submit if already submitting
    if (isSubmitting) return;

    // Check server before attempting login
    if (serverStatus === 'offline') {
      toast.error('Server is offline. Please wait for reconnection.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      toast.error(message);

      // If it was a network error, update server status
      if (!error.response) {
        setServerStatus('offline');
        // Start auto-retry
        retryTimerRef.current = setTimeout(handleRetryConnection, 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back</h1>
          <p className="text-text-muted">Sign in to Startup CRM Lite</p>
        </div>

        {/* Server status banner */}
        {serverStatus === 'offline' && (
          <div className="mb-6 p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Server offline. Reconnecting...</span>
            </div>
            <button
              onClick={handleRetryConnection}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Retry connection"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
            </button>
          </div>
        )}

        {serverStatus === 'checking' && (
          <div className="mb-6 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center space-x-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Checking server connection...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text-main dark:text-white placeholder-text-muted/70 dark:placeholder-text-subtle caret-primary dark:caret-white transition-colors"
                placeholder="you@startup.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text-main dark:text-white placeholder-text-muted/70 dark:placeholder-text-subtle caret-primary dark:caret-white transition-colors"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isSubmitting || serverStatus === 'offline' || serverStatus === 'checking'}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-text-muted text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
