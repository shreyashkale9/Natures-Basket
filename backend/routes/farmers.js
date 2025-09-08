const express = require('express');
const router = express.Router();
const { 
  getFarmerDashboard,
  getFarmerProducts,
  getFarmerOrders,
  updateFarmerProfile
} = require('../controllers/farmers');
const { protect, authorizeFarmer, checkFarmerApproval } = require('../middleware/auth');

// Dashboard - Allow pending farmers to see pending message
router.get('/dashboard', protect, authorizeFarmer, getFarmerDashboard);

// All other farmer routes require farmer authentication and approval
router.use(protect, authorizeFarmer, checkFarmerApproval);

// Products
router.get('/products', getFarmerProducts);

// Orders
router.get('/orders', getFarmerOrders);

// Profile
router.put('/profile', updateFarmerProfile);

module.exports = router;
