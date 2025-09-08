const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create order
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    shippingAddress, 
    paymentMethod, 
    customerNotes 
  } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Validate items and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: item.product,
      farmer: product.farmer,
      quantity: item.quantity,
      unitPrice: item.price,
      total: itemTotal
    });

    // Update product stock
    product.stock -= item.quantity;
    product.sales += item.quantity;
    await product.save();
  }

  const shippingCost = 50; // Fixed shipping cost
  const platformFee = subtotal * 0.1; // 10% platform fee
  const total = subtotal + shippingCost + platformFee;

  // Create order
  const order = await Order.create({
    customer: req.user.id,
    items: orderItems,
    subtotal,
    shippingCost,
    platformFee,
    total,
    paymentMethod,
    shippingAddress,
    customerNotes
  });

  // Clear cart
  cart.items = [];
  await cart.save();

  // Update user's order history
  await User.findByIdAndUpdate(req.user.id, {
    $push: { 'customerFields.orderHistory': order._id }
  });

  await order.populate('items.product');
  await order.populate('items.farmer', 'firstName lastName');

  res.status(201).json(order);
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private/Customer
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { customer: req.user.id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate('items.product', 'name thumbnail')
    .populate('items.farmer', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'firstName lastName email')
    .populate('items.product')
    .populate('items.farmer', 'firstName lastName farmLocation');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if user owns the order or is admin
  if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/Customer
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.customer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Order cannot be cancelled');
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sales: -item.quantity }
    });
  }

  res.json(order);
});

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private/Farmer
const getFarmerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { 'items.farmer': req.user.id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate('customer', 'firstName lastName email')
    .populate('items.product', 'name thumbnail')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Update order status (Farmer)
// @route   PUT /api/orders/farmer/:id/status
// @access  Private/Farmer
const updateFarmerOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order contains farmer's products
  const hasFarmerItems = order.items.some(
    item => item.farmer.toString() === req.user.id
  );

  if (!hasFarmerItems) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  order.status = status;
  
  // Update timestamps
  if (status === 'confirmed') order.confirmedAt = new Date();
  if (status === 'shipped') order.shippedAt = new Date();
  if (status === 'delivered') order.deliveredAt = new Date();

  await order.save();

  res.json(order);
});

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate('customer', 'firstName lastName email')
    .populate('items.product', 'name thumbnail')
    .populate('items.farmer', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  
  // Update timestamps
  if (status === 'confirmed') order.confirmedAt = new Date();
  if (status === 'shipped') order.shippedAt = new Date();
  if (status === 'delivered') order.deliveredAt = new Date();

  await order.save();

  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getFarmerOrders,
  updateFarmerOrderStatus,
  getAllOrders,
  updateOrderStatus
};
