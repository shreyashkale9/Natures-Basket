const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrder, 
  cancelOrder, 
  getFarmerOrders, 
  updateFarmerOrderStatus 
} = require('../controllers/orders');
const { protect, authorizeCustomer, authorizeFarmer } = require('../middleware/auth');

// Customer routes
router.post('/', protect, authorizeCustomer, createOrder);
router.get('/', protect, authorizeCustomer, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, authorizeCustomer, cancelOrder);

// Farmer routes
router.get('/farmer/orders', protect, authorizeFarmer, getFarmerOrders);
router.put('/farmer/:id/status', protect, authorizeFarmer, updateFarmerOrderStatus);

module.exports = router;
