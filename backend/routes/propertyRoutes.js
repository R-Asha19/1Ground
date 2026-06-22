// routes/propertyRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// ── Public routes ─────────────────────────────────
router.get('/',     getAllProperties);   // browse all
router.get('/:id',  getPropertyById);   // single property

// ── Owner routes (must be logged in as owner or admin) ──
router.get('/owner/my', protect, authorize('owner', 'admin'), getMyProperties);

router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 10),   // up to 10 images
  createProperty
);

router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 10),
  updateProperty
);

router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
