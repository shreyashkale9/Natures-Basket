const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.getFullName());
    console.log('🔑 Role:', admin.role);
    console.log('📊 Status:', admin.status);
    console.log('📅 Created:', admin.createdAt);

    // Test password
    const testPassword = 'admin123';
    const isMatch = await admin.comparePassword(testPassword);
    console.log('🔐 Password test:', isMatch ? '✅ Correct' : '❌ Incorrect');

    // Check if password is hashed
    console.log('🔒 Password hash length:', admin.password.length);

  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdminUser();
