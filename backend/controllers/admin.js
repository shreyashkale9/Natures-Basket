const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Land = require('../models/Land');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts
  const totalUsers = await User.countDocuments({ role: 'customer' });
  const totalFarmers = await User.countDocuments({ role: 'farmer' });
  const totalProducts = await Product.countDocuments();
  const totalLands = await Land.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Get pending counts
  const pendingProducts = await Product.countDocuments({ status: 'pending' });
  const pendingFarmers = await User.countDocuments({ role: 'farmer', status: 'pending' });
  const pendingLands = await Land.countDocuments({ status: 'pending' });

  // Calculate total revenue
  const orders = await Order.find({ status: { $in: ['delivered', 'shipped'] } });
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Calculate recent growth (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo },
    role: 'customer'
  });
  const recentOrders = await Order.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.json({
    totalUsers,
    totalFarmers,
    totalProducts,
    totalLands,
    totalOrders,
    totalRevenue,
    pendingProducts,
    pendingFarmers,
    pendingLands,
    recentGrowth: {
      users: recentUsers,
      orders: recentOrders
    }
  });
});

// @desc    Get all farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
const getAllFarmers = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  
  let query = { role: 'farmer' };
  
  // Search by name, email, or farm location
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { farmLocation: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }
  
  const farmers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json(farmers);
});

// @desc    Verify farmer
// @route   PUT /api/admin/farmers/:id/verify
// @access  Private/Admin
const verifyFarmer = asyncHandler(async (req, res) => {
  const farmer = await User.findById(req.params.id);

  if (!farmer) {
    res.status(404);
    throw new Error('Farmer not found');
  }

  if (farmer.role !== 'farmer') {
    res.status(400);
    throw new Error('User is not a farmer');
  }

  farmer.status = 'active';
  farmer.farmerFields.isVerified = true;
  await farmer.save();

  res.json({
    id: farmer._id,
    firstName: farmer.firstName,
    lastName: farmer.lastName,
    email: farmer.email,
    status: farmer.status,
    message: 'Farmer verified successfully'
  });
});

// @desc    Reject farmer
// @route   PUT /api/admin/farmers/:id/reject
// @access  Private/Admin
const rejectFarmer = asyncHandler(async (req, res) => {
  const farmer = await User.findById(req.params.id);

  if (!farmer) {
    res.status(404);
    throw new Error('Farmer not found');
  }

  if (farmer.role !== 'farmer') {
    res.status(400);
    throw new Error('User is not a farmer');
  }

  farmer.status = 'rejected';
  await farmer.save();

  res.json({
    id: farmer._id,
    firstName: farmer.firstName,
    lastName: farmer.lastName,
    email: farmer.email,
    status: farmer.status,
    message: 'Farmer rejected successfully'
  });
});

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // User analytics
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate }
  });

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Order analytics
  const newOrders = await Order.countDocuments({
    createdAt: { $gte: startDate }
  });

  const orderRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Product analytics
  const newProducts = await Product.countDocuments({
    createdAt: { $gte: startDate }
  });

  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    period: days,
    users: {
      new: newUsers,
      growth: userGrowth
    },
    orders: {
      new: newOrders,
      revenue: orderRevenue
    },
    products: {
      new: newProducts,
      categories: productCategories
    }
  });
});

// @desc    Get activity log
// @route   GET /api/admin/activity
// @access  Private/Admin
const getActivityLog = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  // Get recent activities from different collections
  const recentUsers = await User.find()
    .select('firstName lastName email role createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) / 3);

  const recentProducts = await Product.find()
    .select('name category status createdAt')
    .populate('farmer', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) / 3);

  const recentOrders = await Order.find()
    .select('orderNumber total status createdAt')
    .populate('customer', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) / 3);

  // Combine and format activities
  const activities = [
    ...recentUsers.map(user => ({
      type: 'user',
      action: 'New user registered',
      details: `${user.firstName} ${user.lastName} (${user.role})`,
      timestamp: user.createdAt,
      id: user._id
    })),
    ...recentProducts.map(product => ({
      type: 'product',
      action: 'New product added',
      details: `${product.name} by ${product.farmer?.firstName} ${product.farmer?.lastName}`,
      timestamp: product.createdAt,
      id: product._id
    })),
    ...recentOrders.map(order => ({
      type: 'order',
      action: 'New order placed',
      details: `Order #${order.orderNumber} by ${order.customer?.firstName} ${order.customer?.lastName}`,
      timestamp: order.createdAt,
      id: order._id
    }))
  ].sort((a, b) => b.timestamp - a.timestamp)
  .slice(0, parseInt(limit));

  res.json(activities);
});

// @desc    Get all products for admin review
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const { search, status, category, page = 1, limit = 10 } = req.query;
  
  let query = {};
  
  // Search by name, category, or farmer
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Filter by category
  if (category && category !== 'all') {
    query.category = category;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const products = await Product.find(query)
    .populate('farmer', 'firstName lastName email farmLocation')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await Product.countDocuments(query);
  
  res.json({
    products,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Approve product
// @route   PUT /api/admin/products/:id/approve
// @access  Private/Admin
const approveProduct = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.status = 'active';
  product.isApproved = true;
  if (adminNotes) {
    product.adminNotes = adminNotes;
  }
  
  await product.save();

  res.json({
    id: product._id,
    name: product.name,
    status: product.status,
    isApproved: product.isApproved,
    message: 'Product approved successfully'
  });
});

// @desc    Reject product
// @route   PUT /api/admin/products/:id/reject
// @access  Private/Admin
const rejectProduct = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.status = 'rejected';
  product.isApproved = false;
  if (adminNotes) {
    product.adminNotes = adminNotes;
  }
  
  await product.save();

  res.json({
    id: product._id,
    name: product.name,
    status: product.status,
    isApproved: product.isApproved,
    message: 'Product rejected successfully'
  });
});

// @desc    Set product to pending
// @route   PUT /api/admin/products/:id/pending
// @access  Private/Admin
const setProductPending = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.status = 'pending';
  product.isApproved = false;
  if (adminNotes) {
    product.adminNotes = adminNotes;
  }
  
  await product.save();

  res.json({
    id: product._id,
    name: product.name,
    status: product.status,
    isApproved: product.isApproved,
    message: 'Product set to pending successfully'
  });
});

module.exports = {
  getDashboardStats,
  getAllFarmers,
  verifyFarmer,
  rejectFarmer,
  getAllProducts,
  approveProduct,
  rejectProduct,
  setProductPending,
  getAnalytics,
  getActivityLog
};
