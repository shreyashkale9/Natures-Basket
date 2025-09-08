/**
 * @file Product Model
 * @description Defines schema for product listings.
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Review must have a user']
  },
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'], 
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: { 
    type: String, 
    required: [true, 'Comment is required'], 
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const productSchema = new mongoose.Schema({
  uniqueId: { 
    type: String, 
    default: uuidv4, 
    unique: true,
    index: true
  },
  name: { 
    type: String, 
    required: [true, 'Product name is required'], 
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Product category is required'],
    enum: {
      values: ['vegetables', 'fruits', 'herbs', 'organic', 'dairy', 'grains', 'nuts', 'other'],
      message: 'Category must be one of: vegetables, fruits, herbs, organic, dairy, grains, nuts, other'
    }
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'], 
    min: [0.01, 'Price must be greater than 0'],
    max: [10000, 'Price cannot exceed ₹10,000']
  },
  originalPrice: { 
    type: Number, 
    min: [0, 'Original price cannot be negative'],
    max: [10000, 'Original price cannot exceed ₹10,000']
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock quantity is required'], 
    min: [0, 'Stock cannot be negative'],
    max: [10000, 'Stock cannot exceed 10,000 units'],
    default: 0
  },
  unit: { 
    type: String, 
    required: [true, 'Unit is required'],
    enum: {
      values: ['kg', 'g', 'pieces', 'bundle', 'lb'],
      message: 'Unit must be one of: kg, g, pieces, bundle, lb'
    }
  },
  minOrderQuantity: { 
    type: Number, 
    min: [1, 'Minimum order quantity must be at least 1'],
    default: 1
  },
  maxOrderQuantity: { 
    type: Number, 
    min: [1, 'Maximum order quantity must be at least 1']
  },
  
  // Images
  images: [{ type: String }],
  thumbnail: { type: String },
  
  // Farmer info
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String },
  
  // Land info
  land: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Land', 
    required: [true, 'Product must be associated with a land'] 
  },
  
  // Product details
  organic: { type: Boolean, default: true },
  fresh: { type: Boolean, default: true },
  seasonality: { type: String },
  harvestDate: { type: Date },
  expiryDate: { type: Date },
  
  // Pricing breakdown
  farmerPrice: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  
  // Shipping info
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  
  // Status and moderation
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'rejected'], 
    default: 'pending' 
  },
  isApproved: { type: Boolean, default: false },
  adminNotes: { type: String },
  
  // Reviews and ratings
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  
  // SEO and visibility
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  
  // Analytics
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
productSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }
};

productSchema.methods.isAvailable = function() {
  return this.stock > 0 && this.status === 'active' && this.isApproved;
};

productSchema.methods.isProductApproved = function() {
  return this.isApproved && this.status === 'active';
};

productSchema.methods.isPending = function() {
  return this.status === 'pending';
};

productSchema.methods.isRejected = function() {
  return this.status === 'rejected';
};

productSchema.methods.reduceStock = function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    this.sales += quantity;
    return true;
  }
  return false;
};

productSchema.methods.addReview = function(userId, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  if (existingReview) {
    throw new Error('User has already reviewed this product');
  }
  
  this.reviews.push({ user: userId, rating, comment });
  this.updateAverageRating();
};

// Static methods
productSchema.statics.findApproved = function() {
  return this.find({ status: 'active', isApproved: true });
};

productSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active', isApproved: true });
};

productSchema.statics.findByFarmer = function(farmerId) {
  return this.find({ farmer: farmerId });
};

productSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

productSchema.statics.searchProducts = function(searchTerm) {
  return this.find({
    $and: [
      { status: 'active', isApproved: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  });
};

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, status: 1, isApproved: 1 });
productSchema.index({ farmer: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
