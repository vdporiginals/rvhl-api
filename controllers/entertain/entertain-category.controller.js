const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/entertain/entertainCategory.model');
// const Blog = require('../../models/blog/blog.model');
//@desciption   Get all category
//@route        GET  /api/blogs/categories
// @route     GET /api/blogs/categories/:id
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(
        `blog not found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

//@desciption   create Blog category
//@route        POst  /api/blogs/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new blog category`,
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

//@desciption   Update Blog category
//@route        PUT  /api/blogs/categories/:id
//@access       Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

//@desciption   Delete Blog category
//@route        DELETE  /api/blogs/category/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

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
