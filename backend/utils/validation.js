/**
 * @file Validation utilities for Nature's Basket API
 * @description Input validation schemas and middleware using Joi
 */

const Joi = require('joi');

// Common validation patterns
const commonPatterns = {
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().min(2).max(50).required().trim(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional().allow(''),
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  positiveNumber: Joi.number().positive().precision(2),
  positiveInteger: Joi.number().integer().min(0)
};

// User validation schemas
const userSchemas = {
  registration: Joi.object({
    firstName: commonPatterns.name,
    lastName: commonPatterns.name,
    email: commonPatterns.email,
    password: commonPatterns.password,
    phone: commonPatterns.phone,
    role: Joi.string().valid('customer', 'farmer', 'admin').required(),
    farmLocation: Joi.string().max(200).optional().allow(''),
    farmDescription: Joi.string().max(500).optional().allow('')
  }),

  login: Joi.object({
    email: commonPatterns.email,
    password: Joi.string().required()
  }),

  profileUpdate: Joi.object({
    firstName: commonPatterns.name.optional(),
    lastName: commonPatterns.name.optional(),
    phone: commonPatterns.phone,
    farmLocation: Joi.string().max(200).optional().allow(''),
    farmDescription: Joi.string().max(500).optional().allow(''),
    addresses: Joi.array().items(
      Joi.object({
        houseNumber: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zipcode: Joi.string().required(),
        isDefault: Joi.boolean().default(false)
      })
    ).optional()
  }),

  passwordChange: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonPatterns.password
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    description: Joi.string().min(10).max(1000).required().trim(),
    category: Joi.string().valid(
      'vegetables', 'fruits', 'herbs', 'organic', 
      'dairy', 'grains', 'nuts', 'other'
    ).required(),
    price: commonPatterns.positiveNumber.required(),
    stock: commonPatterns.positiveInteger.required(),
    unit: Joi.string().valid('kg', 'g', 'pieces', 'bundle', 'lb').required(),
    minOrderQuantity: Joi.number().integer().min(1).default(1),
    maxOrderQuantity: Joi.number().integer().min(1).optional(),
    organic: Joi.boolean().default(true),
    fresh: Joi.boolean().default(true),
    images: Joi.array().items(Joi.string().uri()).optional(),
    thumbnail: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string().max(20)).optional(),
    harvestDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    weight: Joi.number().positive().optional()
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100).optional().trim(),
    description: Joi.string().min(10).max(1000).optional().trim(),
    category: Joi.string().valid(
      'vegetables', 'fruits', 'herbs', 'organic', 
      'dairy', 'grains', 'nuts', 'other'
    ).optional(),
    price: commonPatterns.positiveNumber.optional(),
    stock: commonPatterns.positiveInteger.optional(),
    unit: Joi.string().valid('kg', 'g', 'pieces', 'bundle', 'lb').optional(),
    minOrderQuantity: Joi.number().integer().min(1).optional(),
    maxOrderQuantity: Joi.number().integer().min(1).optional(),
    organic: Joi.boolean().optional(),
    fresh: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    thumbnail: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string().max(20)).optional(),
    harvestDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    weight: Joi.number().positive().optional(),
    status: Joi.string().valid('active', 'inactive', 'pending', 'rejected').optional(),
    adminNotes: Joi.string().max(500).optional().allow('')
  }),

  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(10).max(500).required().trim()
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: commonPatterns.objectId,
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      houseNumber: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipcode: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('card', 'cash', 'upi', 'wallet').required(),
    customerNotes: Joi.string().max(500).optional().allow('')
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid(
      'pending', 'confirmed', 'processing', 
      'shipped', 'delivered', 'cancelled'
    ).required(),
    adminNotes: Joi.string().max(500).optional().allow(''),
    trackingNumber: Joi.string().max(100).optional().allow('')
  })
};

// Admin validation schemas
const adminSchemas = {
  approveFarmer: Joi.object({
    adminNotes: Joi.string().max(500).optional().allow('')
  }),

  approveProduct: Joi.object({
    adminNotes: Joi.string().max(500).optional().allow('')
  }),

  rejectProduct: Joi.object({
    adminNotes: Joi.string().max(500).optional().allow('')
  }),

  createUser: Joi.object({
    firstName: commonPatterns.name,
    lastName: commonPatterns.name,
    email: commonPatterns.email,
    password: commonPatterns.password,
    phone: commonPatterns.phone,
    role: Joi.string().valid('customer', 'farmer', 'admin').required(),
    status: Joi.string().valid('active', 'pending', 'suspended', 'rejected').default('active'),
    farmLocation: Joi.string().max(200).optional().allow(''),
    farmDescription: Joi.string().max(500).optional().allow('')
  })
};

// Query parameter validation schemas
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional().allow(''),
    sortBy: Joi.string().max(50).optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  productFilters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(12),
    search: Joi.string().max(100).optional().allow(''),
    category: Joi.string().max(50).optional().allow(''),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    organic: Joi.boolean().optional(),
    sortBy: Joi.string().valid('name', 'price', 'createdAt', 'averageRating').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  adminFilters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional().allow(''),
    status: Joi.string().max(50).optional().allow(''),
    category: Joi.string().max(50).optional().allow(''),
    role: Joi.string().valid('customer', 'farmer', 'admin').optional()
  })
};

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        value: detail.context?.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Replace the original data with validated and sanitized data
    if (source === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }
    
    next();
  };
};

// Specific validation middlewares
const validateUserRegistration = validate(userSchemas.registration);
const validateUserLogin = validate(userSchemas.login);
const validateProfileUpdate = validate(userSchemas.profileUpdate);
const validatePasswordChange = validate(userSchemas.passwordChange);

const validateProductCreate = validate(productSchemas.create);
const validateProductUpdate = validate(productSchemas.update);
const validateProductReview = validate(productSchemas.review);

const validateOrderCreate = validate(orderSchemas.create);
const validateOrderStatusUpdate = validate(orderSchemas.updateStatus);

const validateAdminApproveFarmer = validate(adminSchemas.approveFarmer);
const validateAdminApproveProduct = validate(adminSchemas.approveProduct);
const validateAdminRejectProduct = validate(adminSchemas.rejectProduct);
const validateAdminCreateUser = validate(adminSchemas.createUser);

const validatePagination = validate(querySchemas.pagination, 'query');
const validateProductFilters = validate(querySchemas.productFilters, 'query');
const validateAdminFilters = validate(querySchemas.adminFilters, 'query);

// Utility function to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  next();
};

module.exports = {
  // Schemas
  userSchemas,
  productSchemas,
  orderSchemas,
  adminSchemas,
  querySchemas,
  
  // Validation middleware
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateProductCreate,
  validateProductUpdate,
  validateProductReview,
  validateOrderCreate,
  validateOrderStatusUpdate,
  validateAdminApproveFarmer,
  validateAdminApproveProduct,
  validateAdminRejectProduct,
  validateAdminCreateUser,
  validatePagination,
  validateProductFilters,
  validateAdminFilters,
  validateObjectId
};
