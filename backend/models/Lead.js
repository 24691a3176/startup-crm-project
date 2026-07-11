import mongoose from 'mongoose';

/**
 * Lead Schema definition for the Startup CRM Lite application.
 */
const leadSchema = new mongoose.Schema(
  {
    /**
     * Name of the lead (person or contact name).
     * Required field, minimum 2 characters, maximum 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    /**
     * Company the lead belongs to.
     * Required field for B2B CRM tracking.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * Email address of the lead.
     * Required for communication. Must be properly formatted.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * Phone number of the lead.
     * Optional field.
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * Current status of the lead in the sales pipeline.
     */
    status: {
      type: String,
      enum: {
        values: [
          'New',
          'Contacted',
          'Meeting Scheduled',
          'Proposal Sent',
          'Won',
          'Lost',
        ],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
    /**
     * Source from where the lead originated.
     */
    source: {
      type: String,
      enum: {
        values: [
          'Website',
          'Referral',
          'LinkedIn',
          'Cold Call',
          'Email Campaign',
          'Other',
        ],
        message: '{VALUE} is not a valid lead source',
      },
      default: 'Website',
    },
    /**
     * Additional notes or context about the lead.
     * Optional, maximum 1000 characters.
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    /**
     * The User who owns or is responsible for this lead.
     * Reference to the User model.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must have an owner'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true },
  }
);

/**
 * Virtual field to calculate the age of the lead in days.
 * Useful for analytics to see how long a lead has been in the system.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Indexes for query optimization

// Compound index on owner and status for fast dashboard queries
// (e.g., getting all 'New' leads for a specific user)
leadSchema.index({ owner: 1, status: 1 });

// Index on email for fast lookups and potential duplicate checks
leadSchema.index({ email: 1 });

// Index for fast chronological sorting and monthly aggregations
leadSchema.index({ owner: 1, createdAt: -1 });

// Index for source breakdown facet
leadSchema.index({ owner: 1, source: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export { leadSchema };
export default Lead;
