import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Generate JWT Token Helper
 * @param {string} userId - Database ID of the user
 * @returns {string} Signed JWT Token
 */
export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  console.log(`[Auth] JWT generated for user ${userId} (expires: ${process.env.JWT_EXPIRES_IN || '7d'})`);
  return token;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Auth] Registration attempt for email: ${email}`);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`[Auth] Registration failed — email already exists: ${email}`);
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create new User document
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Convert user document to object (removes password via schema toJSON override)
    const userObj = user.toJSON();

    console.log(`[Auth] Registration successful for: ${email} (id: ${user._id})`);
    return res.status(201).json({
      success: true,
      token,
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Login attempt for email: ${email}`);

    // Find user by email and explicitly include password for comparison
    const user = await User.findOne({ email }).select('+password');

    // If not found or password wrong: generic error message for security
    if (!user || !(await user.comparePassword(password))) {
      console.warn(`[Auth] Login failed — invalid credentials for: ${email}`);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn(`[Auth] Login failed — account deactivated: ${email}`);
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Convert user document to object (removes password via schema toJSON override)
    const userObj = user.toJSON();

    console.log(`[Auth] Login successful for: ${email} (id: ${user._id})`);
    return res.status(200).json({
      success: true,
      token,
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by the protect middleware
    return successResponse(res, req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name, or password if old password provided)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Fetch full user record including password for verification
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Allow updating name
    if (name) {
      user.name = name;
    }

    // If attempting to update password
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Please provide your old password to set a new one', 400);
      }

      // Validate old password
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Incorrect old password', 401);
      }

      // Set new password (will be hashed automatically by pre-save middleware)
      user.password = newPassword;
    }

    // Save updated user
    await user.save();

    // Convert to object and return, password removed via toJSON override
    const updatedUserObj = user.toJSON();

    return successResponse(res, updatedUserObj, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
