console.log('[Startup] Loading environment...');
// Load env vars FIRST, before anything that reads process.env
import dotenv from 'dotenv';
dotenv.config();

console.log('[Startup] Initializing Express application...');
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// File imports
import connectDB, { getDbStatus } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Initialize express app
const app = express();

// ==========================================
// ENVIRONMENT VALIDATION
// ==========================================
const checkRequiredEnvVars = () => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error(`[FATAL ERROR] Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Log loaded configuration (mask sensitive values)
  console.log('[Config] Environment variables loaded:');
  console.log(`  PORT         = ${process.env.PORT || '5000 (default)'}`);
  console.log(`  NODE_ENV     = ${process.env.NODE_ENV || 'development (default)'}`);
  console.log(`  MONGODB_URI  = ${process.env.MONGODB_URI ? '***configured***' : 'MISSING'}`);
  console.log(`  JWT_SECRET   = ${process.env.JWT_SECRET ? '***configured***' : 'MISSING'}`);
  console.log(`  FRONTEND_URL = ${process.env.FRONTEND_URL || 'not set'}`);
};

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================
console.log('[Startup] Initializing middleware...');

// 1. Trust Proxy
// Required for Render/Vercel deployments to correctly identify client IP for rate limiting
app.set('trust proxy', 1);

// 2. CORS configuration
// Must be configured BEFORE rate limiting and other middleware to ensure CORS headers are sent on all responses (including 429s)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",

    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove undefined if FRONTEND_URL is not set
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Handle preflight requests

// 3. Security Headers
app.use(helmet());

// 4. Logging
// In production: use 'combined' for detailed logs. In dev: use 'dev' for concise colorized logs.
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 5. Rate Limiting
const isDev = process.env.NODE_ENV !== 'production';

// General rate limit: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});

// Auth rate limit: stricter in production, relaxed in development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 15,
  message: 'Too many auth attempts, please try again later.'
});

app.use('/api/', generalLimiter);

// 6. Body Parser
// express.json reads data from body into req.body. 
// Limits payload size to 10kb to prevent Denial of Service (DOS) attacks
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded data (e.g. form submissions)
app.use(express.urlencoded({ extended: true }));

// 7. Data Sanitization against NoSQL query injection
// express-mongo-sanitize is incompatible with Express 5 (req.query is read-only).
// This custom middleware sanitizes req.body and req.params to prevent MongoDB injection attacks.
const sanitizeValue = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeValue(obj[key]);
    }
  }
  return obj;
};

app.use((req, _res, next) => {
  if (req.body) sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  next();
});


// ==========================================
// API ROUTES
// ==========================================
console.log('[Startup] Registering routes...');

// Authentication related routes with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Leads related routes
app.use('/api/leads', leadRoutes);

// Health check endpoint — verifies both server and database status
app.get('/api/health', (req, res) => {
  const db = getDbStatus();
  const isHealthy = db.readyState === 1; // 1 = connected

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: db.status,
      readyState: db.readyState,
    },
  });
});


// ==========================================
// ERROR HANDLING
// ==========================================

// Global error handler middleware MUST be registered LAST (after all routes)
app.use(errorHandler);


// ==========================================
// SERVER INITIALIZATION & SHUTDOWN
// ==========================================

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

// Validate environment before attempting to start
checkRequiredEnvVars();

let server;

// Start listening for requests immediately so health checks pass, then connect to database
const startServer = async () => {
  try {
    console.log('[Startup] Starting server...');
    server = app.listen(PORT, () => {
      console.log('[Startup] Listening...');
      console.log('');
      console.log('='.repeat(50));
      console.log(`  🚀 Server running on port ${PORT} in ${MODE} mode`);
      console.log(`  📡 API:    http://localhost:${PORT}/api`);
      console.log(`  💊 Health: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50));
      console.log('');
      console.log('[Startup] Startup complete.');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${PORT} is already in use. Please free the port or use a different one.`);
      } else {
        console.error('[Server] Server error:', err.message);
      }
    });

    // Now connect to the database in the background
    // If it takes a long time, the server is still available to respond to health checks
    console.log('[Startup] Connecting Mongo...');
    await connectDB();
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    // Don't exit — the health endpoint won't be reachable, but we log clearly
  }
};

startServer();

// ==========================================
// PROCESS ERROR HANDLERS
// ==========================================

// Catch unhandled promise rejections (e.g., failed DB queries without .catch())
process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled Promise Rejection:', reason);
  // Don't crash — log and continue
});

// Catch uncaught exceptions (synchronous throws that weren't caught)
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
  // For uncaught exceptions, it's safest to shut down gracefully
  // The process manager (pm2, systemd, etc.) will restart the process
  if (server) {
    server.close(() => {
      console.log('[Process] Server closed after uncaught exception. Exiting...');
      process.exit(1);
    });
    // Force exit if graceful shutdown takes too long
    setTimeout(() => process.exit(1), 5000);
  } else {
    process.exit(1);
  }
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n[Process] Received ${signal}. Server shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('[Process] HTTP server closed.');
      process.exit(0);
    });
    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.error('[Process] Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

