import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';

const router = express.Router();

// Define valid enums to reuse in validation
const VALID_STATUSES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];
const VALID_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

// Validation rules for creating/updating a lead
const leadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),
];

// Validation rules for updating status only
const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

// Apply protect middleware to ALL routes in this file
router.use(protect);

// ---------------------------------------------------------
// Analytics/Stats Routes (must come before /:id routes)
// ---------------------------------------------------------
router.get('/stats', getLeadStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/search', searchLeads);

// ---------------------------------------------------------
// Core CRUD Routes
// ---------------------------------------------------------
router.route('/')
  .get(getLeads)
  .post(validate(leadValidation), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(leadValidation), updateLead)
  .delete(deleteLead);

// Specialized route for updating status via drag-and-drop or quick edit
router.patch('/:id/status', validate(statusValidation), updateLeadStatus);

export default router;
