const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../../controllers/blog.controller');

const Blog = require('../../models/blog.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Blog, null), getBlogs)
  .post(createBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;
