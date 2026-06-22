// backend/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage')

// ── POST /api/contact ─────────────────────────────
// Anyone can submit a contact form — saves to DB
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' })
    }

    const msg = await ContactMessage.create({ name, email, phone, subject, message })
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── GET /api/contact ──────────────────────────────
// Admin only: get all messages (inbox)
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: messages.length, messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── PATCH /api/contact/:id/read ───────────────────
// Admin marks message as read
const markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    res.status(200).json({ success: true, message: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── DELETE /api/contact/:id ───────────────────────
// Admin deletes a message
const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id)
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    res.status(200).json({ success: true, message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── GET /api/contact/unread-count ─────────────────
// Admin: get count of unread messages (for badge)
const getUnreadCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ isRead: false })
    res.status(200).json({ success: true, count })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { submitContact, getAllMessages, markAsRead, deleteMessage, getUnreadCount }