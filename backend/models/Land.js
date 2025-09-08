/**
 * @file Land Model
 * @description Defines schema for land/farm listings.
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const landSchema = new mongoose.Schema({
  uniqueId: { 
    type: String, 
    default: uuidv4, 
    unique: true,
    index: true
  },
  name: { 
    type: String, 
    required: [true, 'Land name is required'], 
    trim: true,
    minlength: [3, 'Land name must be at least 3 characters'],
    maxlength: [100, 'Land name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Land description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  size: {
    area: {
      type: Number,
      required: [true, 'Land area is required'],
      min: [0.01, 'Area must be greater than 0']
    },
    unit: {
      type: String,
      required: [true, 'Area unit is required'],
      enum: ['acres', 'hectares', 'sqft', 'sqm'],
      default: 'acres'
    }
  },
  soilType: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'other'],
    default: 'loamy'
  },
  waterSource: {
    type: String,
    required: [true, 'Water source is required'],
    enum: ['well', 'borewell', 'canal', 'river', 'rainwater', 'municipal', 'other'],
    default: 'well'
  },
  irrigation: {
    type: String,
    required: [true, 'Irrigation method is required'],
    enum: ['drip', 'sprinkler', 'flood', 'manual', 'none'],
    default: 'manual'
  },
  organic: {
    type: Boolean,
    default: false
  },
  certification: {
    type: String,
    enum: ['organic', 'natural', 'conventional', 'none'],
    default: 'conventional'
  },
  images: [{ type: String }],
  thumbnail: { type: String },
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Land must belong to a farmer']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  crops: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid', 'year-round'],
      required: true
    },
    yield: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'tonne'],
      default: 'kg'
    }
  }],
  facilities: [{
    type: String,
    enum: ['storage', 'processing', 'packaging', 'transport', 'electricity', 'fencing', 'other']
  }],
  availability: {
    type: String,
    enum: ['available', 'occupied', 'seasonal', 'maintenance'],
    default: 'available'
  },
  leaseInfo: {
    available: {
      type: Boolean,
      default: false
    },
    rate: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['per acre', 'per hectare', 'per month', 'per year'],
      default: 'per acre'
    },
    duration: {
      type: String,
      enum: ['short-term', 'long-term', 'seasonal'],
      default: 'long-term'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Indexes for better performance
landSchema.index({ farmer: 1, status: 1 });
landSchema.index({ status: 1, isApproved: 1 });
landSchema.index({ 'location.city': 1, 'location.state': 1 });
landSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
landSchema.index({ createdAt: -1 });
landSchema.index({ organic: 1, certification: 1 });

// Virtual for full address
landSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Virtual for area with unit
landSchema.virtual('areaWithUnit').get(function() {
  return `${this.size.area} ${this.size.unit}`;
});

// Pre-save middleware to update updatedAt
landSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to search lands
landSchema.statics.searchLands = function(searchTerm, filters = {}) {
  const query = { status: 'active', isApproved: true };
  
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { 'location.city': { $regex: searchTerm, $options: 'i' } },
      { 'location.state': { $regex: searchTerm, $options: 'i' } },
      { soilType: { $regex: searchTerm, $options: 'i' } }
    ];
  }
  
  // Apply filters
  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.state) query['location.state'] = new RegExp(filters.state, 'i');
  if (filters.soilType) query.soilType = filters.soilType;
  if (filters.organic) query.organic = filters.organic === 'true';
  if (filters.certification) query.certification = filters.certification;
  if (filters.minArea) query['size.area'] = { $gte: parseFloat(filters.minArea) };
  if (filters.maxArea) {
    query['size.area'] = { ...query['size.area'], $lte: parseFloat(filters.maxArea) };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Land', landSchema);
