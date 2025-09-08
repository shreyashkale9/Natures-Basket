const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const recreateAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ role: 'admin' });
    console.log('🗑️  Deleted existing admin user');

    // Create new admin user (password will be hashed by pre-save hook)
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@naturesbasket.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      phone: '+1 (555) 123-4567',
      adminFields: {
        permissions: ['manage_users', 'manage_products', 'manage_orders', 'manage_farmers'],
        isSuperAdmin: true
      }
    });

    await adminUser.save();
    console.log('✅ New admin user created successfully!');
    console.log('📧 Email: admin@naturesbasket.com');
    console.log('🔑 Password: admin123');

    // Test the password
    const testPassword = 'admin123';
    const isMatch = await adminUser.comparePassword(testPassword);
    console.log('🔐 Password test:', isMatch ? '✅ Correct' : '❌ Incorrect');

  } catch (error) {
    console.error('❌ Error recreating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

recreateAdminUser();
