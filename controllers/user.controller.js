const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user.model');
const Authorize = require('../models/authorization/authorize.model');
// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  let authorize = await Authorize.create(req.body.authorizeData);
  if (req.body.phone === '') {
    delete req.body.phone;
  }

  if (!authorize) {
    authorize = await Authorize.create({});
  }

  req.body.authorizeId = authorize._id;
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updateData = {
    // authorizeId: req.body.authorizeId,
    avatar: req.body.avatar,
    description: req.body.description,
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user._id,
  });
});

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findById(req.params.id, async (err, val) => {
    await Authorize.findByIdAndDelete(val.authorizeId);
  });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
