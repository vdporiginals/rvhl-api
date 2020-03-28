const path = require("path");
const ErrorResponse = require("../middleware/utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../middleware/utils/geocoder");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
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
  const blog = await Blog.findById(req.params.id);
  const user = await User.findById(blog.user);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: blog,
    user: user.name
  });
});

//@desciption   create Blog
//@route        POST  /api/blogs
//@access       Private
exports.createBlog = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  if (req.user.role !== "moderator" && req.user.role !== "admin") {
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
    data: blog
  });
});

//@desciption   Update Blog
//@route        PUT  /api/blogs/:id
//@access       Private
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (user.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog ${user._id}`,
        401
      )
    );
  }

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: blog });
});

//@desciption   Delete Blog
//@route        DELETE  /api/blogs/:id
//@access       Private
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  const user = await User.findById(blog.user);

  if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this blog ${user._id}`,
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

  res.status(200).json({ success: true, data: {} });
});
