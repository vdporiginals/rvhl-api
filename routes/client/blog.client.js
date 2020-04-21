const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategory,
} = require('../../controllers/blog.controller');

const Blog = require('../../models/blog.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(Blog, {
      path: 'user',
      select: 'name avatar description',
    }),
    getBlogs
  )
  .post(protect, authorize('moderator', 'admin'), createBlog);

router.route('/category').get(getBlogCategory);

router
  .route('/:id')
  .get(protect, authorize('admin'), getBlog)
  .put(protect, authorize('moderator', 'admin'), updateBlog)
  .delete(protect, authorize('moderator', 'admin'), deleteBlog);

module.exports = router;
