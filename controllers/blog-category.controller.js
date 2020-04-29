const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/blogCategory.model');
const Blog = require('../models/blog.model');
//@desciption   Get all category
//@route        GET  /api/blogs/categories
// @route     GET /api/blogs/categories/:id
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getBlogbyCategory = asyncHandler(async (req, res, next) => {
  let blog = Blog.find({ category: req.params.categoryId })
    .populate({
      path: 'category',
      select: 'name',
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    blog = blog.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    blog = blog.sort(sortBy);
  } else {
    blog = blog.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Blog.countDocuments(blog);
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

  blog = blog.skip(startIndex).limit(limit);
  const result = await blog;
  // const total = await Blog.countDocuments(...req.query);
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    pagination,
    count: total,
    data: result,
  });
});

//@desciption   create Blog category
//@route        POst  /api/blogs/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

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
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(
      new ErrorResponse(`category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: category });
});

//@desciption   Delete Blog category
//@route        DELETE  /api/blogs/categories/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (req.user.role !== 'admin' || req.user.role !== 'moderator') {
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

  res.status(200).json({ success: true, data: {} });
});
