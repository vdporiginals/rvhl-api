const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../../controllers/blog/blog.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../../controllers/blog/blog-category.controller');
const Blog = require('../../models/blog/blog.model');
const advancedResults = require('../../middleware/advancedResults');
const Category = require('../../models/blog/blogCategory.model');
const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Blog, [
      {
        path: 'user',
        select: 'name avatar description',
      },
      {
        path: 'commentsCount',
      },
      {
        path: 'replyCount',
      },
    ]),
    getBlogs
  )
  .post(protect, authorize('write', 'moderator', 'admin'), createBlog);

router
  .route('/category')
  .post(protect, authorize('write', 'moderator', 'admin'), createCategory)
  .get(advancedResults(Category, null), getCategories);

router
  .route('/category/:categoryId')
  .get(getCategory)
  .put(protect, authorize('write', 'moderator', 'admin'), updateCategory)
  .delete(protect, authorize('delete', 'moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('write', 'moderator', 'admin'), updateBlog)
  .delete(protect, authorize('delete', 'moderator', 'admin'), deleteBlog);

module.exports = router;
