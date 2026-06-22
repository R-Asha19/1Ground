// controllers/authController.js

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: generate JWT token ─────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ── Helper: send token response ────────────────────
const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      phone: user.phone,
    },
  });
};

// ── POST /api/auth/register ───────────────────────
// Customers and Owners register here (not admins)
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Prevent someone from registering as admin via API
    if (role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot register as admin' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Owners MUST provide a phone number (for WhatsApp contact)
    if (role === 'owner' && !phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required for owners' });
    }

    const user = await User.create({ name, email, password, role: role || 'customer', phone });
    sendToken(user, 201, res);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/login ───────────────────────────
// All roles login here (admin, owner, customer)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and explicitly include the password field (it's hidden by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }

    sendToken(user, 200, res);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/auth/me ───────────────────────────────
// Returns currently logged-in user's info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/auth/update-profile ──────────────────
// Owner can update their phone number etc.
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
