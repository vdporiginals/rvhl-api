const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/estate/estateCategory.model');
const Homestay = require('../../models/estate/homestay.model');

//@desciption   Get all homestay
//@route        GET  /estate/homestays
//@access       Public
exports.getHomestays = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single homestay
//@route        GET  /estate/homestays/:id
//@access       Public
exports.getHomestay = asyncHandler(async (req, res, next) => {
  const homestay = await Homestay.findById(req.params.id);

  if (!homestay) {
    return next(
      new ErrorResponse(`homestay not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: homestay,
  });
});

//@desciption   create homestay
//@route        POST  /estate/homestays
//@access       Private
exports.createHomestay = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with id of ${req.body.category}`,
        404
      )
    );
  }

  const homestay = await Homestay.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      _id: homestay._id,
    },
  });
});

//@desciption   Update homestay
//@route        PUT  /estate/homestays/:id
//@access       Private
exports.updateHomestay = asyncHandler(async (req, res, next) => {
  const homestay = await Homestay.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!homestay) {
    return next(
      new ErrorResponse(`homestay not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      _id: homestay._id,
    },
  });
});

//@desciption   Delete homestay
//@route        DELETE  /estate/homestays/:id
//@access       Private
exports.deleteHomestay = asyncHandler(async (req, res, next) => {
  const homestay = await Homestay.findById(req.params.id);

  if (!homestay) {
    return next(
      new ErrorResponse(`homestay not found with id of ${req.params.id}`, 404)
    );
  }

  homestay.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
