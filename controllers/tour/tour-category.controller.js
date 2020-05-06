const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/tour/tourCategory.model');
const Tour = require('../../models/tour/tour.model');
//@desciption   Get all tour
//@route        GET  /api/tours/categories
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getTourbyCategory = asyncHandler(async (req, res, next) => {
  let tour = Tour.find({
    category: req.params.categoryId
  }).populate({
    path: 'category',
    select: 'name',
  });

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    tour = tour.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    tour = tour.sort(sortBy);
  } else {
    tour = tour.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Tour.countDocuments(tour);
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  tour = tour.skip(startIndex).limit(limit);
  const result = await tour;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    pagination,
    count: total,
    data: result,
  });
});

//@desciption   create Tour category
//@route        POst  /api/tours/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

//@desciption   Update tour category
//@route        PUT  /api/tours/categories/:id
//@access       Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(
      new ErrorResponse(`category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

//@desciption   Delete tour category
//@route        DELETE  /api/tours/categories/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${category._id}`,
        401
      )
    );
  }

  if (!category) {
    return next(
      new ErrorResponse(`category not found with id of ${req.params.id}`, 404)
    );
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});