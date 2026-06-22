// config/seedAdmin.js
// Creates the default admin account on first server start
// Admin credentials come from .env file

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('ℹ️  Admin already exists, skipping seed');
      return;
    }

    // Create admin from .env credentials
    await User.create({
      name:     process.env.ADMIN_NAME     || '1Ground Admin',
      email:    process.env.ADMIN_EMAIL    || 'admin@1ground.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role:     'admin',
      phone:    '9999999999',
      isActive: true,
    });

    console.log('✅ Admin account created:');
    console.log(`   Email:    ${process.env.ADMIN_EMAIL}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
  }
};

module.exports = seedAdmin;
