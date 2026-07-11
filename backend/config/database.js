import mongoose from 'mongoose';

/**
 * Maximum number of reconnect attempts before giving up.
 */
const MAX_RETRIES = 5;

/**
 * Base delay in ms for exponential backoff between reconnect attempts.
 */
const BASE_DELAY_MS = 3000;

/**
 * Tracks the current connection state for the health endpoint.
 * Possible values: 'disconnected' | 'connecting' | 'connected' | 'error'
 */
let dbStatus = 'disconnected';

// ─── Mongoose connection event listeners ────────────────────────────────────
mongoose.connection.on('connected', () => {
  dbStatus = 'connected';
  console.log('[MongoDB] Connection established successfully');
});

mongoose.connection.on('disconnected', () => {
  dbStatus = 'disconnected';
  console.warn('[MongoDB] Disconnected from database');
});

mongoose.connection.on('error', (err) => {
  dbStatus = 'error';
  console.error('[MongoDB] Connection error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  dbStatus = 'connected';
  console.log('[MongoDB] Reconnected to database');
});

// ─── Connect with retry logic ───────────────────────────────────────────────

/**
 * Connects to MongoDB with automatic retry and exponential backoff.
 * Unlike the previous version, this does NOT call process.exit() on failure —
 * the server stays alive and can serve health-check / status responses while
 * retrying the database connection in the background.
 *
 * @param {number} attempt - Current retry attempt (internal use)
 * @returns {Promise<void>}
 */
const connectDB = async (attempt = 1) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[MongoDB] MONGODB_URI is not defined in environment variables');
    // Don't exit — let the health endpoint report the problem
    dbStatus = 'error';
    return;
  }

  try {
    dbStatus = 'connecting';
    console.log(`[MongoDB] Connecting to Atlas (attempt ${attempt}/${MAX_RETRIES})...`);

    await mongoose.connect(uri);

    // 'connected' event handler above will set dbStatus = 'connected'
    console.log(`[MongoDB] Atlas Connected: ${mongoose.connection.host}`);
  } catch (error) {
    dbStatus = 'error';
    console.error(`[MongoDB] Connection attempt ${attempt} failed: ${error.message}`);

    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 3s, 6s, 12s, 24s, 48s
      console.log(`[MongoDB] Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectDB(attempt + 1);
    }

    console.error(`[MongoDB] All ${MAX_RETRIES} connection attempts failed. Server will continue running — health endpoint will report DB status.`);
  }
};

/**
 * Returns the current database connection status.
 * Used by the /api/health endpoint.
 *
 * @returns {{ status: string, readyState: number }}
 */
export const getDbStatus = () => ({
  status: dbStatus,
  readyState: mongoose.connection.readyState,
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
});

export default connectDB;
