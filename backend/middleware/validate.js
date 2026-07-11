import { validationResult } from 'express-validator';

/**
 * Validation middleware builder
 * @param {Array} validations - Array of express-validator rules
 * @returns {Function} Express middleware function that runs validations and checks results
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations concurrently
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Extract validation errors
    const errors = validationResult(req);
    
    // If no errors exist, proceed to next middleware
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to { field, message } format
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param, 
      message: err.msg,
    }));

    // Return 400 with formatted errors
    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};
