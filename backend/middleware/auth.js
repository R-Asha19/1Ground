// middleware/auth.js
// Protects routes by verifying JWT and checking user roles

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Verify JWT Token ──────────────────────────────
// Call this on any route that requires login
const protect = async (req, res, next) => {
  let token;

  // Token comes in the Authorization header as: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login' });
  }

  try {
    // Decode the token to get the user's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB (so we have latest role/isActive status)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Block suspended users from doing anything
    if (!req.user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// ── Role-based Access Control ─────────────────────
// Usage: authorize('admin')  or  authorize('admin', 'owner')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
