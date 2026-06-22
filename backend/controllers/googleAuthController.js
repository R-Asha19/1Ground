// backend/controllers/googleAuthController.js
// Handles Google One-Tap / Sign-In button OAuth flow
// The frontend sends the Google ID token, we verify it and log the user in

const { OAuth2Client } = require('google-auth-library')
const jwt              = require('jsonwebtoken')
const User             = require('../models/User')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ── Helper: generate JWT ──────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

// ── POST /api/auth/google ─────────────────────────
// 1. Frontend gets Google credential (ID token) after user clicks "Continue with Google"
// 2. Frontend sends that token here
// 3. We verify it with Google, get the user's name + email
// 4. If user exists → log them in
// 5. If user doesn't exist → create account automatically
const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body
    // credential = Google ID token sent from frontend

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' })
    }

    // ── Verify the token with Google ──────────────
    const ticket = await client.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    // Extract user info from verified token
    const { name, email, picture, sub: googleId } = ticket.getPayload()

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not get email from Google account' })
    }

    // ── Check if user already exists ─────────────
    let user = await User.findOne({ email })

    if (user) {
      // User exists — check if blocked
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' })
      }
      // Update Google ID and avatar if not already set
      if (!user.googleId) {
        user.googleId = googleId
        user.avatar   = user.avatar || picture
        await user.save()
      }
    } else {
      // ── New user — create account ─────────────
      // Use the role sent from frontend (customer by default)
      // Owners can also sign up with Google, but they need to add phone later
      user = await User.create({
        name,
        email,
        googleId,
        avatar:   picture,
        role:     role || 'customer',
        // Google users don't have a password — they always log in via Google
        // Set a random password so the required field is satisfied
        password: Math.random().toString(36) + Math.random().toString(36) + 'Aa1!',
        isActive: true,
      })
    }

    // ── Generate JWT and return ───────────────────
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        _id:    user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        phone:  user.phone,
        avatar: user.avatar,
      },
      isNewUser: !user.googleId, // frontend can show welcome message for new users
    })

  } catch (err) {
    // Google token verification failed
    console.error('Google auth error:', err.message)
    if (err.message.includes('Token used too late') || err.message.includes('Invalid token')) {
      return res.status(401).json({ success: false, message: 'Google sign-in expired. Please try again.' })
    }
    res.status(500).json({ success: false, message: 'Google sign-in failed. Please try again.' })
  }
}

module.exports = { googleLogin }