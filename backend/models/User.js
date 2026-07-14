import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition for the Startup CRM Lite application.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Full name of the user.
     * Required field, minimum 2 characters, maximum 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * Email address of the user.
     * Used for login and communication. Must be unique and properly formatted.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * Hashed password of the user.
     * Plain text passwords are never stored. Minimum 6 characters required before hashing.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },
    /**
     * Role of the user in the system.
     * Determines access level. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a supported role',
      },
      default: 'user',
    },
    /**
     * Status of the user account.
     * Determines if the user can log in and use the system.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Pre-save middleware to hash the password before saving to the database.
 * Only hashes the password if it has been modified (or is new).
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare a candidate plain-text password with the hashed password.
 * @param {string} candidatePassword - The plain-text password to check.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override the toJSON method to remove sensitive information (like password)
 * before returning the user object in API responses.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export { userSchema };
export default User;
