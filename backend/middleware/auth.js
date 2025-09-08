const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'naturesbasket_super_secret_key_2024';

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Allow pending farmers to access dashboard to see pending message
      // Other farmer routes will be blocked by checkFarmerApproval middleware
      
      // Block suspended or rejected accounts
      if (req.user.status === 'suspended' || req.user.status === 'rejected') {
        res.status(401);
        throw new Error('Account is suspended or rejected');
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  };
};

// Farmer approval check middleware - for actions that require approval
const checkFarmerApproval = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'farmer' && req.user.status !== 'active') {
    res.status(403);
    throw new Error('Farmer account is not approved yet. Please wait for admin approval.');
  }
  next();
});


// Product approval check middleware
const checkProductApproval = asyncHandler(async (req, res, next) => {
  // This will be used in product routes to ensure only approved products are shown to customers
  next();
});

// Specific role middlewares
const authorizeCustomer = authorize('customer');
const authorizeFarmer = authorize('farmer');
const authorizeAdmin = authorize('admin');
const authorizeFarmerOrAdmin = authorize('farmer', 'admin');

// Combined middlewares for common use cases
const protectCustomer = [protect, authorizeCustomer];
const protectFarmer = [protect, authorizeFarmer, checkFarmerApproval];
const protectAdmin = [protect, authorizeAdmin];
const protectFarmerOrAdmin = [protect, authorizeFarmerOrAdmin];

module.exports = {
  protect,
  authorize,
  authorizeCustomer,
  authorizeFarmer,
  authorizeAdmin,
  authorizeFarmerOrAdmin,
  checkFarmerApproval,
  checkProductApproval,
  protectCustomer,
  protectFarmer,
  protectAdmin,
  protectFarmerOrAdmin
};
