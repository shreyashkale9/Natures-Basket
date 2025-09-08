const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Land = require('../models/Land');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    search, 
    category, 
    minPrice, 
    maxPrice, 
    organic,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = { status: 'active', isApproved: true };

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Organic filter
  if (organic === 'true') {
    query.organic = true;
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(query)
    .populate('farmer', 'firstName lastName farmLocation')
    .populate('land', 'name location soilType size organic certification')
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('farmer', 'firstName lastName farmLocation farmDescription')
    .populate('land', 'name location soilType size organic certification images')
    .populate('reviews.user', 'firstName lastName');

  if (product) {
    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get farmer products
// @route   GET /api/products/farmer
// @access  Private/Farmer
const getFarmerProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { farmer: req.user.id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    total
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    price,
    stock,
    unit,
    images,
    thumbnail,
    organic,
    harvestDate,
    expiryDate,
    minOrderQuantity,
    maxOrderQuantity,
    weight,
    tags,
    land
  } = req.body;

  // Validate that land is provided
  if (!land) {
    res.status(400);
    throw new Error('Land is required to create a product');
  }

  // Validate that the land exists and belongs to the farmer
  const landDoc = await Land.findById(land);
  if (!landDoc) {
    res.status(404);
    throw new Error('Land not found');
  }

  if (landDoc.farmer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('You can only create products for your own lands');
  }

  // Check if land is approved
  if (landDoc.status !== 'approved' || !landDoc.isApproved) {
    res.status(400);
    throw new Error('Can only create products for approved lands');
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    originalPrice: price,
    stock,
    unit,
    images,
    thumbnail,
    farmer: req.user.id,
    farmName: req.user.farmerFields?.farmName,
    land: land,
    organic,
    harvestDate,
    expiryDate,
    minOrderQuantity,
    maxOrderQuantity,
    weight,
    tags,
    farmerPrice: price * 0.9, // 90% of price goes to farmer
    platformFee: price * 0.1, // 10% platform fee
    status: 'pending'
  });

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Farmer or Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check authorization: Farmer can edit own products, Admin can edit any
  if (req.user.role === 'farmer' && product.farmer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  // If admin is approving/rejecting, handle special logic
  if (req.user.role === 'admin' && req.body.status) {
    const { status, adminNotes } = req.body;
    
    if (status === 'active') {
      req.body.isApproved = true;
      req.body.status = 'active';
    } else if (status === 'rejected') {
      req.body.isApproved = false;
      req.body.status = 'rejected';
    }
    
    if (adminNotes) {
      req.body.adminNotes = adminNotes;
    }
  }

  // If farmer is updating, reset to pending status (needs admin approval)
  if (req.user.role === 'farmer' && req.body.status !== 'pending') {
    req.body.status = 'pending';
    req.body.isApproved = false;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user owns the product
  if (product.farmer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private/Customer
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user.id
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    user: req.user.id,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.updateAverageRating();

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = {
  getProducts,
  getProduct,
  getFarmerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};
