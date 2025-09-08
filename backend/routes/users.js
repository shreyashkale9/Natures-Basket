const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  createUser, 
  deleteUser,
  updateUserStatus
} = require('../controllers/users');
const { protect, authorizeAdmin } = require('../middleware/auth');

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, authorizeAdmin, getAllUsers);
router.post('/', protect, authorizeAdmin, createUser);
router.put('/:id/status', protect, authorizeAdmin, updateUserStatus);
router.delete('/:id', protect, authorizeAdmin, deleteUser);

module.exports = router;
