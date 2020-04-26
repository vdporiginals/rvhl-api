const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../middleware/utils/geocoder');
const Blog = require('../models/blog.model');
const User = require('../models/user.model');
//@desciption   Get all Blogs
//@route        GET  /api/blogs
//@access       Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get all category
//@route        GET  /api/category
//@access       Public
exports.getBlogCategory = asyncHandler(async (req, res, next) => {
  const results = await Blog.find().select('category');

  const uniqueRes = results.filter((val, index) => {
    const _val = JSON.stringify(val.category);
    return (
      index ===
      results.findIndex((obj) => {
        return JSON.stringify(obj.category) === _val;
      })
    );
  });

  res.status(200).json({
    success: true,
    data: uniqueRes,
  });
});

//@desciption   Get single blog
//@route        GET  /api/blogs/:id
//@access       Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate({
    path: 'user',
    select: 'name avatar description email',
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

//@desciption   create Blog
//@route        POST  /api/blogs
//@access       Private
exports.createBlog = asyncHandler(async (req, res, next) => {
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

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog,
  });
});

//@desciption   create comment
//@route        POST  /api/blogs/:id
//@access       Private
exports.createComment = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  if (!req.user) {
    return next(
      new ErrorResponse(`The user has no permission to create new comment`, 400)
    );
  }

  const comment = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: comment,
  });
});

//@desciption   create reply
//@route        POST  /api/blogs/:id/comments/:commentId
//@access       Private
exports.createReply = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  if (!req.user) {
    return next(
      new ErrorResponse(`The user has no permission to create new blog`, 400)
    );
  }

  const reply = await Comment.findByIdAndUpdate(req.params.commentId, {
    reply: req.body,
  });

  res.status(201).json({
    success: true,
    data: reply,
  });
});

//@desciption   Update Blog
//@route        PUT  /api/blogs/:id
//@access       Private
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const user = await Blog.findById(req.params.id);

  if (user.user.toString() !== req.user.id && req.user.role !== 'admin') {
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

  res.status(200).json({ success: true, data: blog });
});

//@desciption   Delete Blog
//@route        DELETE  /api/blogs/:id
//@access       Private
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
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

  res.status(200).json({ success: true, data: {} });
});
