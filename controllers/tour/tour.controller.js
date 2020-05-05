const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const geocoder = require('../../middleware/utils/geocoder');
const Tour = require('../../models/tour/tour.model');
const Category = require('../../models/tour/tourCategory.model');
//@desciption   Get all tour
//@route        GET  /api/tours
//@access       Public
exports.getTours = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Tour
//@route        GET  /api/tours/:id
//@access       Public
exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'tourCategory',
    select: 'name description',
  });

  if (!tour) {
    return next(
      new ErrorResponse(`tour not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: tour,
  });
});

//@desciption   create tour
//@route        POST  /api/tour
//@access       Private
exports.createTour = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.categoryId}`),
      404
    );
  }

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  const tour = await Tour.create(req.body);

  res.status(201).json({
    success: true,
    data: tour,
  });
});

//@desciption   Update tour
//@route        PUT  /api/tour/:id
//@access       Private
exports.updateTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(
      new ErrorResponse(`tour not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: tour
  });
});

//@desciption   Delete tour
//@route        DELETE  /api/tour/:id
//@access       Private
exports.deleteTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  if (!tour) {
    return next(
      new ErrorResponse(`tour not found with id of ${req.params.id}`, 404)
    );
  }

  tour.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});