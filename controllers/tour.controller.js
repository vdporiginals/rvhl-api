const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../middleware/utils/geocoder');
const Tour = require('../models/tour.model');
const User = require('../models/user.model');
//@desciption   Get all tour
//@route        GET  /api/tour
//@access       Public
exports.getTour = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Tour
//@route        GET  /api/tour/:id
//@access       Public
exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: tour
  });
});

//@desciption   create Blog
//@route        POST  /api/tour
//@access       Private
exports.createTour = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new blog`,
        400
      )
    );
  }

  const tour = await Tour.create(req.body);

  res.status(201).json({
    success: true,
    data: tour
  });
});

//@desciption   Update tour
//@route        PUT  /api/tour/:id
//@access       Private
exports.updateTour = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (user.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog ${user._id}`,
        401
      )
    );
  }

  if (!tour) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: tour });
});

//@desciption   Delete Blog
//@route        DELETE  /api/tour/:id
//@access       Private
exports.deleteTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (tour.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  if (!tour) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  tour.remove();

  res.status(200).json({ success: true, data: {} });
});
