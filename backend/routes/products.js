const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  getFarmerProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addReview 
} = require('../controllers/products');
const { 
  protect, 
  protectCustomer, 
  protectFarmer, 
  protectAdmin,
  protectFarmerOrAdmin 
} = require('../middleware/auth');

// Public routes - only approved products for customers
router.get('/', getProducts); // Shows only approved products to public

// Farmer routes (must come before :id route)
router.get('/farmer', protectFarmer, getFarmerProducts); // Farmer can see all their products
router.post('/', protectFarmer, createProduct); // Farmer can create products (pending approval)
router.put('/:id', protectFarmerOrAdmin, updateProduct); // Farmer can edit own, Admin can edit any
router.delete('/:id', protectFarmerOrAdmin, deleteProduct); // Farmer can delete own, Admin can delete any

// Public routes (must come after specific routes)
router.get('/:id', getProduct); // Public can view individual products
router.post('/:id/reviews', protectCustomer, addReview); // Only customers can add reviews

module.exports = router;
