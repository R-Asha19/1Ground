// backend/models/ContactMessage.js
const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    // Admin can mark as read
    isRead:  { type: Boolean, default: false },
    // Admin reply (optional)
    reply:   { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ContactMessage', contactMessageSchema)