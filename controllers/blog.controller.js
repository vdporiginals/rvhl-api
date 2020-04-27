const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../middleware/utils/geocoder');
const Blog = require('../models/blog.model');
const Comment = require('../models/comment.model');
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
//@route        POST  /api/blogs/:id/comments
//@access       Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser === null) {
    return res.redirect('/login');
  }
  Blog.findById(req.params.id)
    .then((post) => {
      const author = req.user;
      const authorId = author._id;
      const postId = req.params.id;
      const content = req.body.content;
      const authorName = author.username;
      const comment = new Comment({
        content,
        postId,
        author: authorId,
        authorName,
        authorAvatar: author.avatar,
      });
      post.comments.unshift(comment);
      post.save();
      return res.status(201).json({
        success: true,
        data: comment,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//@desciption   create reply
//@route        POST  /api/blogs/:id/comments/:commentId
//@access       Private
exports.createReply = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser === null) {
    return res.redirect('/login');
  }

  const username = currentUser.name;
  const postId = req.params.id;
  const commentId = req.params.commentId;

  Blog.findById(postId)
    .then((post) => {
      // console.log(">>> Found post:", post);
      const findComment = (id, reply) => {
        if (reply.length > 0) {
          for (var index = 0; index < reply.length; index++) {
            const comment = reply[index];
            if (comment._id == id) {
              return comment;
            }
            const foundComment = findComment(id, comment.reply);
            if (foundComment) {
              return foundComment;
            }
          }
        }
      };
      // Step 1 find comment id -------------------'
      const comment = findComment(commentId, post.comments);

      // console.log(comment);
      // make a new comment
      const commentNew = new Comment({
        content: req.body.content,
        author: currentUser._id,
        postId,
        authorName: username,
      });

      // Step 2 unshift new comment ---------------------------
      comment.reply.unshift(commentNew);

      post.markModified('comments');
      return post.save();
    })
    .then((post) => {
      return res.status(201).json({
        success: true,
        data: post.reply,
      });
    })
    .catch((err) => {
      console.log(err);
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
