const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get farmer dashboard stats
// @route   GET /api/farmers/dashboard
// @access  Private (Farmer)
const getFarmerDashboard = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;

  // Get farmer's products
  const products = await Product.find({ farmer: farmerId });
  
  // Get farmer's orders
  const orders = await Order.find({ 
    'items.product': { $in: products.map(p => p._id) }
  }).populate('user', 'firstName lastName email');

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active' && p.isApproved).length;
  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const farmerItems = order.items.filter(item => 
      products.some(p => p._id.toString() === item.product.toString())
    );
    return sum + farmerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
  }, 0);

  // Get recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get recent products
  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.json({
    stats: {
      totalProducts,
      activeProducts,
      pendingProducts,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2)
    },
    recentOrders,
    recentProducts,
    accountStatus: req.user.status
  });
});

// @desc    Get farmer's products
// @route   GET /api/farmers/products
// @access  Private (Farmer)
const getFarmerProducts = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  
  const products = await Product.find({ farmer: farmerId })
    .sort({ createdAt: -1 });

  res.json({
    products,
    count: products.length
  });
});

// @desc    Get farmer's orders
// @route   GET /api/farmers/orders
// @access  Private (Farmer)
const getFarmerOrders = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  
  // Get farmer's products
  const products = await Product.find({ farmer: farmerId });
  const productIds = products.map(p => p._id);
  
  // Get orders that contain farmer's products
  const orders = await Order.find({ 
    'items.product': { $in: productIds }
  })
  .populate('user', 'firstName lastName email')
  .populate('items.product', 'name price')
  .sort({ createdAt: -1 });

  res.json({
    orders,
    count: orders.length
  });
});

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile
// @access  Private (Farmer)
const updateFarmerProfile = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  
  const { farmName, farmLocation, farmDescription, phone } = req.body;
  
  const farmer = await User.findByIdAndUpdate(
    farmerId,
    { 
      farmName, 
      farmLocation, 
      farmDescription, 
      phone 
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json(farmer);
});

module.exports = {
  getFarmerDashboard,
  getFarmerProducts,
  getFarmerOrders,
  updateFarmerProfile
};
