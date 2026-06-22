// models/User.js

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Not required for Google OAuth users
      required: false,
      minlength: 6,
      select: false, // never returned in queries unless explicitly asked
    },

    // ── Role controls what the user can do ──────────
    role: {
      type: String,
      enum: ['admin', 'owner', 'customer'],
      default: 'customer',
    },

    // ── Owner's WhatsApp number for direct contact ──
    phone: {
      type: String,
      trim: true,
    },

    // ── Google OAuth ID (set when user signs in with Google) ──
    googleId: {
      type: String,
      default: '',
    },

    // ── Profile picture (from Google or uploaded) ──
    avatar: {
      type: String,
      default: '',
    },

    // Admin can block any user
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// ── Hash password before saving ──────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified (not on other updates)
  if (!this.isModified('password')) return next();
  // Skip hashing if no password (Google OAuth users)
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method to compare passwords on login ─────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google OAuth users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);