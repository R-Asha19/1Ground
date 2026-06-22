// routes/adminRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getDashboard,
  getAllOwners,
  getAllCustomers,
  getAllPropertiesAdmin,
  toggleBlockUser,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, authorize('admin'));

router.get('/dashboard',   getDashboard);
router.get('/owners',      getAllOwners);
router.get('/customers',   getAllCustomers);
router.get('/properties',  getAllPropertiesAdmin);

router.patch('/users/:id/block',  toggleBlockUser);
router.delete('/users/:id',       deleteUser);

module.exports = router;
