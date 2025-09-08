const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'naturesbasket_super_secret_key_2024';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user (customer or farmer)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role, farmLocation, farmDescription } = req.body;

  // Check if user exists with same email and role
  const userExists = await User.findOne({ email, role });
  if (userExists) {
    return res.status(400).json({
      message: `User with email ${email} already exists as ${role}`,
      error: 'EMAIL_ROLE_EXISTS'
    });
  }

  // Validate role
  if (!['customer', 'farmer'].includes(role)) {
    return res.status(400).json({
      message: 'Invalid role. Must be customer or farmer',
      error: 'INVALID_ROLE'
    });
  }

  // Create user data
  const userData = {
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    status: role === 'farmer' ? 'pending' : 'active' // Farmers start as pending
  };

  // Add farmer-specific fields
  if (role === 'farmer') {
    userData.farmLocation = farmLocation;
    userData.farmDescription = farmDescription;
  }

  // Create user
  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      message: `${role === 'farmer' ? 'Farmer' : 'Customer'} registration successful`,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        farmLocation: user.farmLocation,
        farmDescription: user.farmDescription
      },
      token: generateToken(user._id)
    });
  } else {
    return res.status(400).json({
      message: 'Invalid user data',
      error: 'INVALID_DATA'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Check for user with specific email and role
  const user = await User.findOne({ email, role }).select('+password');
  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials or role',
      error: 'INVALID_CREDENTIALS'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid credentials',
      error: 'INVALID_CREDENTIALS'
    });
  }

  // Check if user is active (allow admins and farmers to login regardless of status)
  if (user.status !== 'active') {
    if (user.role === 'admin') {
      // Admins can always login
      console.log(`Admin ${user.email} logging in with status: ${user.status}`);
    } else if (user.role === 'farmer') {
      // Allow farmers to login regardless of status
      console.log(`Farmer ${user.email} logging in with status: ${user.status}`);
    } else {
      return res.status(401).json({
        message: 'Account is not active',
        error: 'ACCOUNT_INACTIVE'
      });
    }
  }

  // Update last login for admins
  if (user.role === 'admin') {
    user.adminFields.lastLogin = new Date();
    await user.save();
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      profileImage: user.profileImage,
      farmLocation: user.farmLocation,
      farmDescription: user.farmDescription,
      customerFields: user.customerFields,
      farmerFields: user.farmerFields,
      adminFields: user.adminFields
    },
    token: generateToken(user._id)
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      addresses: user.addresses,
      profileImage: user.profileImage,
      farmLocation: user.farmLocation,
      farmDescription: user.farmDescription,
      customerFields: user.customerFields,
      farmerFields: user.farmerFields,
      adminFields: user.adminFields
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = {
  register,
  login,
  getMe,
  logout
};
