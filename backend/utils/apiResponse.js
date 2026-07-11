/**
 * Sends a standardized success JSON response.
 *
 * @param {Object} res - Express response object
 * @param {any} data - The payload to send
 * @param {string} [message='Success'] - An optional success message
 * @param {number} [statusCode=200] - HTTP status code
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error JSON response.
 *
 * @param {Object} res - Express response object
 * @param {string} message - An error message describing the issue
 * @param {number} [statusCode=500] - HTTP status code
 * @param {any} [errors=null] - Additional error details (e.g., validation errors)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Sends a standardized paginated JSON response.
 *
 * @param {Object} res - Express response object
 * @param {Array} data - Array of records for the current page
 * @param {number} total - Total number of records across all pages
 * @param {number} page - Current page number
 * @param {number} limit - Number of records per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 20;
  const pages = Math.ceil(total / parsedLimit);
  
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages,
      hasNext: parsedPage < pages,
      hasPrev: parsedPage > 1,
    },
  });
};
