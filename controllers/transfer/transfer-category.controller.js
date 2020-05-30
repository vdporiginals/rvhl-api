const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/transfer/transferCategory.model');
//@desciption   Get all category
//@route        GET  /api/estates/categories
// @route     GET /api/estates/categories/:id
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(
        `Transfer category not found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

//@desciption   create estate category
//@route        POst  /api/estates/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new estate category`,
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

//@desciption   Update estate category
//@route        PUT  /api/estates/categories/:id
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
    data: category,
  });
});

//@desciption   Delete estate category
//@route        DELETE  /api/estates/category/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete transfer ${category._id}`,
        401
      )
    );
  }

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
