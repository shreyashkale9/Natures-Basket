/**
 * @file Seed Data
 * @description Script to populate database with initial data
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedCategories = async () => {
  const categories = [
    {
      name: 'Vegetables',
      description: 'Fresh organic vegetables',
      icon: '🥬',
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Fruits',
      description: 'Fresh organic fruits',
      icon: '🍎',
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Herbs',
      description: 'Fresh herbs and spices',
      icon: '🌿',
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Root Vegetables',
      description: 'Fresh root vegetables',
      icon: '🥕',
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Leafy Greens',
      description: 'Fresh leafy greens',
      icon: '🥬',
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Exotic Vegetables',
      description: 'Exotic and specialty vegetables',
      icon: '🥒',
      isActive: true,
      isFeatured: false
    }
  ];

  try {
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@naturesbasket.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@naturesbasket.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      addresses: [{
        houseNumber: '123',
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        country: 'Admin Country',
        zipcode: '12345'
      }],
      adminFields: {
        permissions: ['manage_users', 'manage_products', 'manage_orders', 'manage_farmers'],
        isSuperAdmin: true
      },
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@naturesbasket.com');
    console.log('🔑 Password: admin123');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

const seedData = async () => {
  await connectDB();
  await seedCategories();
  await seedAdminUser();
  console.log('🎉 Database seeding completed!');
  process.exit(0);
};

// Run the seed function
seedData();
