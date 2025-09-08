const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/admin');
const { 
  getAllLands,
  approveLand,
  rejectLand,
  setLandPending
} = require('../controllers/lands');
const { getAllOrders, updateOrderStatus } = require('../controllers/orders');
const { protectAdmin } = require('../middleware/auth');

// All admin routes require admin authorization
router.use(protectAdmin);

// Dashboard and analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/activity', getActivityLog);

// Farmer management
router.get('/farmers', getAllFarmers);
router.put('/farmers/:id/verify', verifyFarmer);
router.put('/farmers/:id/reject', rejectFarmer);

// Product management
router.get('/products', getAllProducts);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);
router.put('/products/:id/pending', setProductPending);

// Land management
router.get('/lands', getAllLands);
router.put('/lands/:id/approve', approveLand);
router.put('/lands/:id/reject', rejectLand);
router.put('/lands/:id/pending', setLandPending);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
