// controllers/adminController.js

const User     = require('../models/User');
const Property = require('../models/Property');

// ── GET /api/admin/dashboard ──────────────────────
// Overview stats for admin dashboard
const getDashboard = async (req, res) => {
  try {
    const [totalOwners, totalCustomers, totalProperties, availableProperties] = await Promise.all([
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'customer' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOwners,
        totalCustomers,
        totalProperties,
        availableProperties,
        rentedProperties: totalProperties - availableProperties,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/owners ─────────────────────────
// All owners + how many properties each has posted
const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).sort({ createdAt: -1 });

    // For each owner, get their properties
    const ownersWithProperties = await Promise.all(
      owners.map(async (owner) => {
        const properties = await Property.find({ owner: owner._id })
          .select('title city price status type createdAt images');
        return {
          _id:        owner._id,
          name:       owner.name,
          email:      owner.email,
          phone:      owner.phone,
          isActive:   owner.isActive,
          joinedAt:   owner.createdAt,
          totalPosts: properties.length,
          properties,
        };
      })
    );

    res.status(200).json({ success: true, owners: ownersWithProperties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/customers ──────────────────────
// All registered customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: customers.length, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/properties ─────────────────────
// ALL properties across all owners (admin view)
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/admin/users/:id/block ─────────────
// Admin can block or unblock any user
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from blocking another admin
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`,
      isActive: user.isActive,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/admin/users/:id ───────────────────
// Admin can delete any user (and their properties)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });

    // Delete all properties posted by this user
    await Property.deleteMany({ owner: req.params.id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and their properties deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getAllOwners,
  getAllCustomers,
  getAllPropertiesAdmin,
  toggleBlockUser,
  deleteUser,
};
