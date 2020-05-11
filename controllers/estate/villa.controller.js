const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/estate/estateCategory.model');
const Villa = require('../../models/estate/villa.model');

//@desciption   Get all villa
//@route        GET  /estate/villas
//@access       Public
exports.getVillas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single villa
//@route        GET  /estate/villas/:id
//@access       Public
exports.getVilla = asyncHandler(async (req, res, next) => {
  const villa = await Villa.findById(req.params.id);

  if (!villa) {
    return next(
      new ErrorResponse(`villa not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: villa,
  });
});

//@desciption   create villa
//@route        POST  /estate/villas
//@access       Private
exports.createVilla = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with id of ${req.body.category}`,
        404
      )
    );
  }

  const villa = await Villa.create(req.body);

  res.status(201).json({
    success: true,
    data: villa._id,
  });
});

//@desciption   Update villa
//@route        PUT  /estate/villas/:id
//@access       Private
exports.updateVilla = asyncHandler(async (req, res, next) => {
  const villa = await Villa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!villa) {
    return next(
      new ErrorResponse(`villa not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: villa._id,
  });
});

//@desciption   Delete villa
//@route        DELETE  /estate/villas/:id
//@access       Private
exports.deleteVilla = asyncHandler(async (req, res, next) => {
  const villa = await Villa.findById(req.params.id);

  if (!villa) {
    return next(
      new ErrorResponse(`villa not found with id of ${req.params.id}`, 404)
    );
  }

  villa.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
