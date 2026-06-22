// backend/routes/contactRoutes.js
const express = require('express')
const router  = express.Router()
const {
  submitContact,
  getAllMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/contactController')
const { protect, authorize } = require('../middleware/auth')

// Public — anyone can submit
router.post('/', submitContact)

// Admin only
router.get('/',                  protect, authorize('admin'), getAllMessages)
router.get('/unread-count',      protect, authorize('admin'), getUnreadCount)
router.patch('/:id/read',        protect, authorize('admin'), markAsRead)
router.delete('/:id',            protect, authorize('admin'), deleteMessage)

module.exports = router