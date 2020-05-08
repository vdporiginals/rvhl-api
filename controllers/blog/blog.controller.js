const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const geocoder = require('../../middleware/utils/geocoder');
const Blog = require('../../models/blog/blog.model');
const Category = require('../../models/blog/blogCategory.model');
//@desciption   Get all Blogs
//@route        GET  /api/blogs
//@access       Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single blog
//@route        GET  /api/blogs/:id
//@access       Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name avatar description email',
    })
    .populate({
      path: 'category',
      select: 'name',
    });

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});

//@desciption   create Blog add category ID to body
//@route        POST  /api/blogs
//@access       Private
exports.createBlog = asyncHandler(async (req, res, next) => {
  //add user to req.body
  // req.body.category = req.params.categoryId;
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
        `The user with ID ${req.user.id} has no permission to create new blog`,
        400
      )
    );
  }

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog._id,
  });
});


//@desciption   Update Blog
//@route        PUT  /api/blogs/:id
//@access       Private
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const user = await Blog.findById(req.params.id);

  if (user.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog ${user._id}`,
        401
      )
    );
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: blog._id
  });
});

//@desciption   Delete Blog
//@route        DELETE  /api/blogs/:id
//@access       Private
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  blog.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});