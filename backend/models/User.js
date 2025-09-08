/**
 * @file User Model
 * @description Defines schema for users (customer/farmer/admin).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const addressSchema = new mongoose.Schema({
  houseNumber: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [50, 'House number cannot exceed 50 characters']
  },
  street: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [100, 'Street name cannot exceed 100 characters']
  },
  city: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  state: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters']
  },
  country: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [50, 'Country name cannot exceed 50 characters']
  },
  zipcode: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^\d{5,6}$/, 'Please enter a valid zipcode']
  },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  uniqueId: { 
    type: String, 
    default: uuidv4, 
    unique: true,
    index: true
  },
  firstName: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'], 
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  phone: { 
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  role: { 
    type: String, 
    enum: {
      values: ['customer', 'farmer', 'admin'],
      message: 'Role must be customer, farmer, or admin'
    }, 
    required: [true, 'Role is required']
  },
  status: { 
    type: String, 
    enum: {
      values: ['active', 'pending', 'suspended', 'rejected'],
      message: 'Status must be active, pending, suspended, or rejected'
    }, 
    default: 'active'
  },
  addresses: [addressSchema],
  profileImage: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid image URL']
  },
  
  // Farmer specific fields
  farmLocation: { type: String },
  farmDescription: { type: String },
  farmerFields: {
    farmName: { type: String },
    isVerified: { type: Boolean, default: false },
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      accountHolderName: { type: String }
    },
    totalEarnings: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 }
  },
  
  // Customer specific fields
  customerFields: {
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    defaultAddress: { type: Number, default: 0 }
  },
  
  // Admin specific fields
  adminFields: {
    permissions: [{ type: String }],
    lastLogin: { type: Date },
    isSuperAdmin: { type: Boolean, default: false }
  },
  
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.isActive = function() {
  return this.status === 'active';
};

userSchema.methods.isFarmer = function() {
  return this.role === 'farmer';
};

userSchema.methods.isCustomer = function() {
  return this.role === 'customer';
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role, status: 'active' });
};

// Indexes for better performance
userSchema.index({ email: 1, role: 1 }, { unique: true }); // Unique combination of email + role
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
