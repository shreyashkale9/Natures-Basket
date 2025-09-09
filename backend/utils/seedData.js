/**
 * @file Seed Data
 * @description Script to populate database with initial data
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Land = require('../models/Land');
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
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@naturesbasket.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      addresses: [{
        houseNumber: '123',
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        country: 'Admin Country',
        zipcode: '12345',
        isDefault: true
      }],
      adminFields: {
        permissions: ['manage_users', 'manage_products', 'manage_orders', 'manage_farmers'],
        isSuperAdmin: true
      },
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

const seedDemoUsers = async () => {
  try {
    // Demo Farmer
    const existingFarmer = await User.findOne({ email: 'farmer@example.com' });
    if (!existingFarmer) {
      const farmerUser = new User({
        firstName: 'John',
        lastName: 'Farmer',
        email: 'farmer@example.com',
        password: 'farmer123',
        phone: '+1234567891',
        role: 'farmer',
        status: 'active',
        farmLocation: 'Green Valley Farm, California',
        farmDescription: 'Organic farm specializing in fresh vegetables',
        farmerFields: {
          farmName: 'Green Valley Farm',
          isVerified: true,
          bankDetails: {
            accountNumber: '1234567890',
            ifscCode: 'BANK0001234',
            accountHolderName: 'John Farmer'
          },
          totalEarnings: 0,
          totalOrders: 0
        },
        emailVerified: true
      });
      await farmerUser.save();
      console.log('✅ Demo farmer created successfully');
      console.log('📧 Email: farmer@example.com');
      console.log('🔑 Password: farmer123');
    }

    // Demo Customer
    const existingCustomer = await User.findOne({ email: 'customer@example.com' });
    if (!existingCustomer) {
      const customerUser = new User({
        firstName: 'Jane',
        lastName: 'Customer',
        email: 'customer@example.com',
        password: 'customer123',
        phone: '+1234567892',
        role: 'customer',
        status: 'active',
        addresses: [{
          houseNumber: '456',
          street: 'Customer Street',
          city: 'Customer City',
          state: 'Customer State',
          country: 'Customer Country',
          zipcode: '54321',
          isDefault: true
        }],
        customerFields: {
          wishlist: [],
          orderHistory: [],
          defaultAddress: 0
        },
        emailVerified: true
      });
      await customerUser.save();
      console.log('✅ Demo customer created successfully');
      console.log('📧 Email: customer@example.com');
      console.log('🔑 Password: customer123');
    }
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  }
};

const seedSampleData = async () => {
  try {
    // Get the farmer user
    const farmer = await User.findOne({ email: 'farmer@example.com' });
    if (!farmer) {
      console.log('❌ Farmer user not found, skipping sample data');
      return;
    }

    // Create sample land
    const existingLand = await Land.findOne({ farmer: farmer._id });
    if (!existingLand) {
      const sampleLand = new Land({
        name: 'Green Valley Organic Farm',
        description: 'A beautiful organic farm located in the heart of California valley, specializing in fresh vegetables and herbs.',
        location: {
          address: '123 Farm Road',
          city: 'Fresno',
          state: 'California',
          pincode: '93701',
          coordinates: {
            latitude: 36.7378,
            longitude: -119.7871
          }
        },
        size: {
          area: 25,
          unit: 'acres'
        },
        soilType: 'loamy',
        waterSource: 'well',
        irrigation: 'drip',
        organic: true,
        certification: 'organic',
        images: ['https://via.placeholder.com/400x300?text=Green+Valley+Farm'],
        farmer: farmer._id,
        status: 'approved',
        isApproved: true,
        crops: [
          { name: 'Tomatoes', season: 'year-round', yield: 500, unit: 'kg' },
          { name: 'Carrots', season: 'year-round', yield: 300, unit: 'kg' },
          { name: 'Spinach', season: 'year-round', yield: 200, unit: 'kg' },
          { name: 'Bell Peppers', season: 'year-round', yield: 150, unit: 'kg' }
        ],
        facilities: ['storage', 'processing', 'packaging', 'electricity'],
        availability: 'available'
      });
      await sampleLand.save();
      console.log('✅ Sample land created successfully');
    }

    // Create sample products
    const existingProducts = await Product.find({ farmer: farmer._id });
    if (existingProducts.length === 0) {
      const land = await Land.findOne({ farmer: farmer._id });
      
      const sampleProducts = [
        {
          name: 'Fresh Organic Tomatoes',
          description: 'Fresh, juicy organic tomatoes grown in our certified organic farm. Perfect for salads, cooking, and fresh consumption.',
          category: 'vegetables',
          price: 50,
          farmerPrice: 40,
          platformFee: 10,
          stock: 100,
          unit: 'kg',
          minOrderQuantity: 1,
          maxOrderQuantity: 50,
          images: ['https://via.placeholder.com/400x300?text=Organic+Tomatoes'],
          farmer: farmer._id,
          land: land._id,
          farmName: 'Green Valley Farm',
          organic: true,
          fresh: true,
          status: 'active',
          isApproved: true,
          tags: ['organic', 'fresh', 'local'],
          featured: true
        },
        {
          name: 'Organic Carrots',
          description: 'Sweet and crunchy organic carrots, rich in beta-carotene. Perfect for juicing, cooking, or snacking.',
          category: 'vegetables',
          price: 40,
          farmerPrice: 32,
          platformFee: 8,
          stock: 80,
          unit: 'kg',
          minOrderQuantity: 1,
          maxOrderQuantity: 40,
          images: ['https://via.placeholder.com/400x300?text=Organic+Carrots'],
          farmer: farmer._id,
          land: land._id,
          farmName: 'Green Valley Farm',
          organic: true,
          fresh: true,
          status: 'active',
          isApproved: true,
          tags: ['organic', 'fresh', 'healthy'],
          featured: true
        },
        {
          name: 'Green Bell Peppers',
          description: 'Fresh green bell peppers, perfect for stir-fries, salads, and stuffing. Grown with natural farming methods.',
          category: 'vegetables',
          price: 60,
          farmerPrice: 48,
          platformFee: 12,
          stock: 50,
          unit: 'kg',
          minOrderQuantity: 1,
          maxOrderQuantity: 25,
          images: ['https://via.placeholder.com/400x300?text=Bell+Peppers'],
          farmer: farmer._id,
          land: land._id,
          farmName: 'Green Valley Farm',
          organic: true,
          fresh: true,
          status: 'active',
          isApproved: true,
          tags: ['organic', 'fresh', 'versatile']
        },
        {
          name: 'Organic Spinach',
          description: 'Fresh organic spinach leaves, rich in iron and vitamins. Perfect for salads, smoothies, and cooking.',
          category: 'vegetables',
          price: 30,
          farmerPrice: 24,
          platformFee: 6,
          stock: 75,
          unit: 'bunch',
          minOrderQuantity: 1,
          maxOrderQuantity: 20,
          images: ['https://via.placeholder.com/400x300?text=Organic+Spinach'],
          farmer: farmer._id,
          land: land._id,
          farmName: 'Green Valley Farm',
          organic: true,
          fresh: true,
          status: 'active',
          isApproved: true,
          tags: ['organic', 'fresh', 'nutritious'],
          featured: true
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

const seedData = async () => {
  await connectDB();
  await seedCategories();
  await seedAdminUser();
  await seedDemoUsers();
  await seedSampleData();
  console.log('🎉 Database seeding completed!');
  process.exit(0);
};

// Run the seed function
seedData();
