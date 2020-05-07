const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  createComment,
  createReply,
  deleteComment,
} = require('../../controllers/blog/blog.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBlogbyCategory,
} = require('../../controllers/blog/blog-category.controller');
const Blog = require('../../models/blog/blog.model');
const advancedResults = require('../../middleware/advancedResults');
const Category = require('../../models/blog/blogCategory.model');
const router = express.Router();

const {
  protect,
  authorize
} = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(
      Blog, {
        path: 'user',
        select: 'name avatar description',
      }, {
        path: 'category',
        select: 'name',
      }, {
        path: 'comments',
        select: 'name',
      }
    ),
    getBlogs
  )
  .post(protect, authorize('moderator', 'admin'), createBlog);

router
  .route('/category')
  .post(protect, authorize('moderator', 'admin'), createCategory)
  .get(
    advancedResults(Category, 'blog'),
    getCategories
  );

router
  .route('/category/:categoryId')
  .get(
    getBlogbyCategory
  )
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('moderator', 'admin'), updateBlog)
  .delete(protect, authorize('moderator', 'admin'), deleteBlog);

router
  .route('/:id/comments/:commentId')
  .post(protect, createReply)
  .put(protect, deleteComment);
router.route('/:id/comments').post(protect, createComment);

module.exports = router;