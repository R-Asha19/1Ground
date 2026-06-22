// models/Property.js

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    // ── Who posted this property ──────────────────
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      required: true,
    },

    // ── Basic info ────────────────────────────────
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    // buy = for sale, rent = for rent.
    // NOTE: this was missing from createProperty/updateProperty before —
    // every property was being saved without it. Fixed in the controller.
    listingType: {
      type: String,
      enum: ['buy', 'rent'],
      required: true,
      default: 'rent',
    },

    type: {
      type: String,
      enum: ['apartment', 'villa', 'studio', 'penthouse', 'plot', 'commercial'],
      required: true,
    },

    // available = shown to customers, rented = taken, unlisted = hidden
    status: {
      type: String,
      enum: ['available', 'rented', 'unlisted'],
      default: 'available',
    },

    // ── Location ──────────────────────────────────
    state:    { type: String, required: true, trim: true },
    city:     { type: String, required: true, trim: true },
    locality: { type: String, trim: true },
    pincode:  { type: String, trim: true },

    // ── Pricing ───────────────────────────────────
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },

    // ── Property Details ──────────────────────────
    bedrooms:  { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    areaSqft:  { type: Number },
    furnished: { type: Boolean, default: false },

    // ── Amenities (checkboxes) ────────────────────
    amenities: {
      type: [String],
      enum: ['WiFi', 'Parking', 'Gym', 'Swimming Pool', 'Security', 'Lift', 'Power Backup', 'Garden'],
      default: [],
    },

    // ── Images (stored in Cloudinary) ─────────────
    images: [
      {
        url:      String,  // Cloudinary URL
        publicId: String,  // used to delete from Cloudinary
      },
    ],

    // ── WhatsApp contact for this property ────────
    // Auto-filled from owner's phone, but can be overridden
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required for contact'],
    },
  },
  { timestamps: true }
);

// ── Text index for search ─────────────────────────
// Allows searching by title, city, locality, state
propertySchema.index({ title: 'text', city: 'text', locality: 'text', state: 'text' });

module.exports = mongoose.model('Property', propertySchema);