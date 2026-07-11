import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all leads for the current user with pagination, filtering, and search
 * @route   GET /api/leads
 * @access  Private
 * 
 * @param {Object} req - Express request object containing query params (status, search, page, limit, sortBy, sortOrder)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Paginated response of leads
 */
export const getLeads = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status, 
      search, 
      source,
      dateFrom,
      dateTo
    } = req.query;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeads] Fetching leads for user: ${req.user._id}, search: ${search || 'none'}, status: ${status || 'All'}`);
    }

    // Always enforce owner isolation
    const filter = { owner: req.user._id };

    // Apply status filter if provided and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Apply source filter if provided and not 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Apply date range filter if provided
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Apply search filter if provided
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive regex
      filter.$or = [
        { name: regex },
        { company: regex },
        { email: regex },
      ];
    }

    // Set up sorting
    const sortObject = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute queries in parallel for efficiency
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortObject)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, page, limit);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Private
 * 
 * @param {Object} req - Express request object containing lead data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} 201 Success response with created lead
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[createLead] Creating lead for user: ${req.user._id}`);
    }

    // Create lead, ensuring owner is set to current user regardless of what they send
    const leadData = {
      ...req.body,
      owner: req.user._id,
    };

    const newLead = await Lead.create(leadData);

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 * 
 * @param {Object} req - Express request object containing lead ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success response with lead data
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadById] Fetching lead ${req.params.id} for user: ${req.user._id}`);
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a lead completely
 * @route   PUT /api/leads/:id
 * @access  Private
 * 
 * @param {Object} req - Express request object containing updated fields in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success response with updated lead
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLead] Updating lead ${req.params.id} for user: ${req.user._id}`);
    }

    // Do NOT allow changing the owner field
    if (req.body.owner) {
      delete req.body.owner;
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update only the status of a lead
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 * 
 * @param {Object} req - Express request object containing status in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success response with updated lead
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLeadStatus] Updating status to ${status} for lead ${req.params.id}, user: ${req.user._id}`);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 * 
 * @param {Object} req - Express request object containing lead ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[deleteLead] Deleting lead ${req.params.id} for user: ${req.user._id}`);
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Perform delete operation
    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for leads using a single aggregation pipeline
 * @route   GET /api/leads/stats
 * @access  Private
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Stats object containing counts and conversion rate
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadStats] Aggregating stats for user: ${req.user._id}`);
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const statsPipeline = [
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          statusBreakdown: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: "$source", count: { $sum: 1 } } }
          ],
          timeBreakdown: [
            {
              $project: {
                isThisMonth: {
                  $cond: [
                    { $and: [ { $gte: ["$createdAt", startOfThisMonth] }, { $lt: ["$createdAt", startOfNextMonth] } ] },
                    1, 0
                  ]
                },
                isLastMonth: {
                  $cond: [
                    { $and: [ { $gte: ["$createdAt", startOfLastMonth] }, { $lt: ["$createdAt", startOfThisMonth] } ] },
                    1, 0
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                thisMonth: { $sum: "$isThisMonth" },
                lastMonth: { $sum: "$isLastMonth" }
              }
            }
          ]
        }
      }
    ];

    const results = await Lead.aggregate(statsPipeline);
    const data = results[0];

    // Format results
    const totalLeads = data.totalCount.length > 0 ? data.totalCount[0].count : 0;
    
    const statusBreakdown = {};
    data.statusBreakdown.forEach(item => {
      statusBreakdown[item._id] = item.count;
    });

    const sourceBreakdown = {};
    data.sourceBreakdown.forEach(item => {
      sourceBreakdown[item._id] = item.count;
    });

    const thisMonthLeads = data.timeBreakdown.length > 0 ? data.timeBreakdown[0].thisMonth : 0;
    const lastMonthLeads = data.timeBreakdown.length > 0 ? data.timeBreakdown[0].lastMonth : 0;

    const wonLeads = statusBreakdown['Won'] || 0;
    const conversionRate = totalLeads > 0 ? Number(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;
    
    const growthRate = lastMonthLeads > 0 
      ? Number((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1)) 
      : (thisMonthLeads > 0 ? 100 : 0);

    const stats = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    };

    return successResponse(res, stats);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly statistics for leads created and won in the last 6 months
 * @route   GET /api/leads/monthly-stats
 * @access  Private
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} Array of monthly objects formatted for charts
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getMonthlyStats] Aggregating monthly stats for user: ${req.user._id}`);
    }

    const now = new Date();
    // Start of the month 5 months ago (so total 6 months including current)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyPipeline = [
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, 1, 0],
            },
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0],
            },
          }
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ];

    const results = await Lead.aggregate(monthlyPipeline);

    // Map month numbers to short names for frontend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate the last 6 months list to handle months with zero leads
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1, // 1-12
        monthName: `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      });
    }

    const formattedData = last6Months.map(targetMonth => {
      const found = results.find(r => r._id.year === targetMonth.year && r._id.month === targetMonth.month);
      const total = found ? found.total : 0;
      const won = found ? found.won : 0;
      const lost = found ? found.lost : 0;
      const conversionRate = total > 0 ? Number(((won / total) * 100).toFixed(1)) : 0;

      return {
        month: targetMonth.monthName,
        total,
        won,
        lost,
        conversionRate
      };
    });

    return successResponse(res, formattedData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search leads for autocomplete
 * @route   GET /api/leads/search
 * @access  Private
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} Array of minimal lead objects
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q = '', limit = 5 } = req.query;

    if (!q) {
      return successResponse(res, []);
    }

    const regex = new RegExp(q, 'i');
    
    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: regex },
        { company: regex },
        { email: regex }
      ]
    })
    .select('_id name company email status')
    .limit(Number(limit));

    return successResponse(res, leads);
  } catch (error) {
    next(error);
  }
};
