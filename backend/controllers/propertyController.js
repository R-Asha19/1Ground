// controllers/propertyController.js

const Property   = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');

// ── GET /api/properties ───────────────────────────
// Public: browse all available properties with filters
const getAllProperties = async (req, res) => {
  try {
    const {
      city, state, type, listingType,
      minPrice, maxPrice, bedrooms, minBedrooms,
      minArea, maxArea, furnished, search,
    } = req.query;

    // Build filter object dynamically
    const filter = { status: 'available' };

    if (city)        filter.city        = new RegExp(`^${city}$`, 'i');
    if (state)        filter.state        = new RegExp(`^${state}$`, 'i');
    if (type)         filter.type         = type;
    if (listingType)  filter.listingType  = listingType;

    if (bedrooms)     filter.bedrooms = Number(bedrooms);
    if (minBedrooms)  filter.bedrooms = { $gte: Number(minBedrooms) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      filter.areaSqft = {};
      if (minArea) filter.areaSqft.$gte = Number(minArea);
      if (maxArea) filter.areaSqft.$lte = Number(maxArea);
    }

    if (furnished === 'true')  filter.furnished = true;
    if (furnished === 'false') filter.furnished = false;

    if (search) {
      filter.$text = { $search: search };
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/properties/:id ────────────────────────
// Public: single property detail
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name phone email avatar');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/properties/my ────────────────────────
// Owner: see only their own listings
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/properties ──────────────────────────
// Owner or Admin: create new property listing
const createProperty = async (req, res) => {
  try {
    const {
      title, description, listingType, type, state, city, locality, pincode,
      price, negotiable, bedrooms, bathrooms, areaSqft,
      furnished, amenities, whatsappNumber, status
    } = req.body;

    // Handle uploaded images (from Cloudinary via multer)
    const images = req.files
      ? req.files.map(file => ({ url: file.path, publicId: file.filename }))
      : [];

    // Use owner's phone as WhatsApp if not provided separately
    const waNumber = whatsappNumber || req.user.phone;

    const property = await Property.create({
      owner: req.user._id,
      title, description, listingType, type, status,
      state, city, locality, pincode,
      price, negotiable,
      bedrooms, bathrooms, areaSqft, furnished,
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      whatsappNumber: waNumber,
    });

    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/properties/:id ───────────────────────
// Owner (own property) or Admin (any property): update listing
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only owner of the property OR admin can update
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const {
      title, description, listingType, type, status, state, city, locality, pincode,
      price, negotiable, bedrooms, bathrooms, areaSqft,
      furnished, amenities, whatsappNumber
    } = req.body;

    // Handle new images if uploaded
    let images = property.images; // keep existing images by default
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const img of property.images) {
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
      images = req.files.map(file => ({ url: file.path, publicId: file.filename }));
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        title, description, listingType, type, status,
        state, city, locality, pincode,
        price, negotiable,
        bedrooms, bathrooms, areaSqft, furnished,
        amenities: amenities ? JSON.parse(amenities) : property.amenities,
        images,
        whatsappNumber,
      },
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email');

    res.status(200).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/properties/:id ────────────────────
// Owner (own) or Admin (any): delete listing
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only owner OR admin can delete
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    // Remove images from Cloudinary
    for (const img of property.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }

    await property.deleteOne();
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};