/**
 * @file Order Model
 * @description Defines schema for user orders.
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: [true, 'Order item must have a product']
  },
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Order item must have a farmer']
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'], 
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  unitPrice: { 
    type: Number, 
    required: [true, 'Unit price is required'],
    min: [0.01, 'Unit price must be greater than 0']
  },
  total: { 
    type: Number, 
    required: [true, 'Total price is required'],
    min: [0.01, 'Total must be greater than 0']
  },
  status: { 
    type: String, 
    enum: {
      values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      message: 'Status must be pending, confirmed, shipped, delivered, or cancelled'
    }, 
    default: 'pending' 
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    index: true,
    default: () => `NB${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Order must have a customer']
  },
  items: [orderItemSchema],
  
  // Order totals
  subtotal: { 
    type: Number, 
    required: [true, 'Subtotal is required'],
    min: [0.01, 'Subtotal must be greater than 0']
  },
  shippingCost: { 
    type: Number, 
    min: [0, 'Shipping cost cannot be negative'],
    default: 0 
  },
  platformFee: { 
    type: Number, 
    min: [0, 'Platform fee cannot be negative'],
    default: 0 
  },
  tax: { 
    type: Number, 
    min: [0, 'Tax cannot be negative'],
    default: 0 
  },
  total: { 
    type: Number, 
    required: [true, 'Total amount is required'],
    min: [0.01, 'Total must be greater than 0']
  },
  
  // Payment info
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'],
    enum: {
      values: ['card', 'cash', 'upi', 'wallet'],
      message: 'Payment method must be card, cash, upi, or wallet'
    }
  },
  paymentStatus: { 
    type: String, 
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be pending, paid, failed, or refunded'
    }, 
    default: 'pending' 
  },
  transactionId: { 
    type: String,
    trim: true
  },
  
  // Shipping info
  shippingAddress: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipcode: { type: String, required: true }
  },
  
  // Order status
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  
  // Timestamps
  orderDate: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  
  // Notes
  customerNotes: { type: String },
  adminNotes: { type: String },
  
  // Tracking
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  const now = new Date();
  
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'shipped':
      this.shippedAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      break;
    case 'cancelled':
      this.cancelledAt = now;
      break;
  }
};

orderSchema.methods.isPending = function() {
  return this.status === 'pending';
};

orderSchema.methods.isConfirmed = function() {
  return this.status === 'confirmed';
};

orderSchema.methods.isShipped = function() {
  return this.status === 'shipped';
};

orderSchema.methods.isDelivered = function() {
  return this.status === 'delivered';
};

orderSchema.methods.isCancelled = function() {
  return this.status === 'cancelled';
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.shippingCost + this.platformFee + this.tax;
  return this.total;
};

// Static methods
orderSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customer: customerId }).sort({ createdAt: -1 });
};

orderSchema.statics.findByFarmer = function(farmerId) {
  return this.find({ 'items.farmer': farmerId }).sort({ createdAt: -1 });
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

orderSchema.statics.findPendingOrders = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

orderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber });
};

// Indexes for better performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.farmer': 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });

// Update timestamp
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
