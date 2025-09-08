const express = require('express');
const router = express.Router();
const {
  getLands,
  getLand,
  getFarmerLands,
  createLand,
  updateLand,
  deleteLand
} = require('../controllers/lands');
const { protect, authorizeFarmer, checkFarmerApproval } = require('../middleware/auth');

// Farmer routes (must come before :id route to avoid conflicts)
router.get('/farmer', protect, authorizeFarmer, getFarmerLands);
router.post('/', protect, authorizeFarmer, createLand);
router.put('/:id', protect, updateLand);
router.delete('/:id', protect, deleteLand);

// Public routes
router.get('/', getLands);
router.get('/:id', getLand);

module.exports = router;
