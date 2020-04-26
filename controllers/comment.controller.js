const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../middleware/utils/geocoder');
const Blog = require('../models/blog.model');
const User = require('../models/user.model');

exports.createComment = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
