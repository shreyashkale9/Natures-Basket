const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Update role-specific fields
    if (user.role === 'farmer') {
      user.farmLocation = req.body.farmLocation || user.farmLocation;
      user.farmDescription = req.body.farmDescription || user.farmDescription;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      farmLocation: updatedUser.farmLocation,
      farmDescription: updatedUser.farmDescription
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, status } = req.query;
  
  let query = {};
  
  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by role
  if (role && role !== 'all') {
    query.role = role;
  }
  
  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }
  
  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phone, farmLocation } = req.body;

  // Check if user exists with same email and role
  const userExists = await User.findOne({ email, role });
  if (userExists) {
    return res.status(400).json({
      message: `User with email ${email} already exists as ${role}`,
      error: 'EMAIL_ROLE_EXISTS'
    });
  }

  // Validate role
  const validRoles = ['customer', 'farmer', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: 'Invalid role',
      error: 'INVALID_ROLE'
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    farmLocation,
    status: role === 'farmer' ? 'pending' : 'active'
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      farmLocation: user.farmLocation,
      status: user.status
    });
  } else {
    return res.status(400).json({
      message: 'Invalid user data',
      error: 'INVALID_DATA'
    });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();

  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    message: 'User status updated successfully'
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  deleteUser,
  updateUserStatus
};
