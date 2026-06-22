// routes/authRoutes.js

const express = require('express');
const router  = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { protect } = require('../middleware/auth');

// ── Public routes ─────────────────────────────────
router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleLogin);   // ← Google OAuth login/register

// ── Protected routes (must be logged in) ─────────
router.get('/me',             protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;