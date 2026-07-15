
/**
 * Global Express error handling middleware.
 * Catches errors from synchronous code or next(err) in async code.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let message = err.message || 'Server error';
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let errors = null;

  // Log error to console for developer visibility
  console.error(err);

  // 1. Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // 2. Mongoose duplicate key (MongoDB Error code 11000)
  else if (err.code === 11000) {
    message = 'Email already exists';
    // Dynamically update the message if it's not the email field
    if (err.keyValue && !err.keyValue.email) {
       const field = Object.keys(err.keyValue)[0];
       message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    statusCode = 409;
  }

  // 3. Mongoose validation error
  else if (err.name === 'ValidationError') {
    message = 'Validation Error';
    statusCode = 400;
    // Extract field-by-field error messages
    errors = Object.values(err.errors).reduce((acc, val) => {
      acc[val.path] = val.message;
      return acc;
    }, {});
  }

  // 4. JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    message = 'Not authorized'; // e.g., invalid token or token expired
    statusCode = 401;
  }

  // Build the final response payload
  const responsePayload = {
    success: false,
    message,
    errors,
  };

  // In development: include err.stack in the response
  if (process.env.NODE_ENV !== 'production') {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
