import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect middleware
 * Validates JWT token and attaches the authenticated user to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user belonging to the token (excluding the password field)
    const user = await User.findById(decoded.id).select('-password');

    // If user no longer exists
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // Attach user to request object for use in subsequent middleware/controllers
    req.user = user;
    next();
  } catch (error) {
    // Check specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token is invalid', 401);
    }
    
    // Other errors pass to global error handler
    next(error);
  }
};
