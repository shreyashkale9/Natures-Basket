const asyncHandler = require('express-async-handler');
const Land = require('../models/Land');

// @desc    Get all lands (public - only approved)
// @route   GET /api/lands
// @access  Public
const getLands = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    search, 
    city, 
    state, 
    soilType, 
    organic,
    certification,
    minArea,
    maxArea,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = { status: 'active', isApproved: true };

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { 'location.state': { $regex: search, $options: 'i' } }
    ];
  }

  // Location filters
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');

  // Soil type filter
  if (soilType) query.soilType = soilType;

  // Organic filter
  if (organic === 'true') query.organic = true;

  // Certification filter
  if (certification) query.certification = certification;

  // Area range
  if (minArea || maxArea) {
    query['size.area'] = {};
    if (minArea) query['size.area'].$gte = parseFloat(minArea);
    if (maxArea) query['size.area'].$lte = parseFloat(maxArea);
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const lands = await Land.find(query)
    .populate('farmer', 'firstName lastName email phone')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  const total = await Land.countDocuments(query);

  res.json({
    lands,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total
  });
});

// @desc    Get single land
// @route   GET /api/lands/:id
// @access  Public
const getLand = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id)
    .populate('farmer', 'firstName lastName email phone farmLocation');

  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  res.json(land);
});

// @desc    Get farmer's lands
// @route   GET /api/lands/farmer
// @access  Private (Farmer)
const getFarmerLands = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  
  const lands = await Land.find({ farmer: farmerId })
    .sort({ createdAt: -1 });

  res.json({
    lands,
    count: lands.length
  });
});

// @desc    Create new land
// @route   POST /api/lands
// @access  Private (Farmer)
const createLand = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    size,
    soilType,
    waterSource,
    irrigation,
    organic,
    certification,
    images,
    thumbnail,
    crops,
    facilities,
    availability,
    leaseInfo
  } = req.body;

  const land = await Land.create({
    name,
    description,
    location,
    size,
    soilType,
    waterSource,
    irrigation,
    organic,
    certification,
    images,
    thumbnail,
    crops,
    facilities,
    availability,
    leaseInfo,
    farmer: req.user.id,
    status: 'pending',
    isApproved: false
  });

  res.status(201).json(land);
});

// @desc    Update land
// @route   PUT /api/lands/:id
// @access  Private (Farmer/Owner or Admin)
const updateLand = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  // Check if user is the owner or admin
  if (land.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this land');
  }

  const updatedLand = await Land.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedLand);
});

// @desc    Delete land
// @route   DELETE /api/lands/:id
// @access  Private (Farmer/Owner or Admin)
const deleteLand = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  // Check if user is the owner or admin
  if (land.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this land');
  }

  await Land.findByIdAndDelete(req.params.id);

  res.json({ message: 'Land deleted successfully' });
});

// @desc    Get all lands for admin
// @route   GET /api/admin/lands
// @access  Private (Admin)
const getAllLands = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    search, 
    status, 
    isApproved,
    farmerId,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = {};

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { 'location.state': { $regex: search, $options: 'i' } }
    ];
  }

  // Status filter
  if (status) query.status = status;
  if (isApproved !== undefined) query.isApproved = isApproved === 'true';
  
  // Farmer filter
  if (farmerId) query.farmer = farmerId;

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const lands = await Land.find(query)
    .populate('farmer', 'firstName lastName email phone farmLocation')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  const total = await Land.countDocuments(query);

  res.json({
    lands,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total
  });
});

// @desc    Approve land
// @route   PUT /api/admin/lands/:id/approve
// @access  Private (Admin)
const approveLand = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const land = await Land.findById(req.params.id);
  
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  land.status = 'approved';
  land.isApproved = true;
  if (adminNotes) {
    land.adminNotes = adminNotes;
  }
  
  await land.save();

  res.json({
    id: land._id,
    name: land.name,
    status: land.status,
    isApproved: land.isApproved,
    message: 'Land approved successfully'
  });
});

// @desc    Reject land
// @route   PUT /api/admin/lands/:id/reject
// @access  Private (Admin)
const rejectLand = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const land = await Land.findById(req.params.id);
  
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  land.status = 'rejected';
  land.isApproved = false;
  if (adminNotes) {
    land.adminNotes = adminNotes;
  }
  
  await land.save();

  res.json({
    id: land._id,
    name: land.name,
    status: land.status,
    isApproved: land.isApproved,
    message: 'Land rejected successfully'
  });
});

// @desc    Set land to pending
// @route   PUT /api/admin/lands/:id/pending
// @access  Private (Admin)
const setLandPending = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const land = await Land.findById(req.params.id);
  
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  land.status = 'pending';
  land.isApproved = false;
  if (adminNotes) {
    land.adminNotes = adminNotes;
  }
  
  await land.save();

  res.json({
    id: land._id,
    name: land.name,
    status: land.status,
    isApproved: land.isApproved,
    message: 'Land set to pending successfully'
  });
});

module.exports = {
  getLands,
  getLand,
  getFarmerLands,
  createLand,
  updateLand,
  deleteLand,
  getAllLands,
  approveLand,
  rejectLand,
  setLandPending
};
