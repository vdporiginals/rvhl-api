const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  createComment,
  createReply,
} = require('../../controllers/blog.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBlogbyCategory,
} = require('../../controllers/blog-category.controller');
const Blog = require('../../models/blog.model');
const advancedResults = require('../../middleware/advancedResults');
const Category = require('../../models/blogCategory.model');
const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(
    protect,
    authorize('apiUser'),
    advancedResults(
      Blog,
      {
        path: 'user',
        select: 'name avatar description',
      },
      {
        path: 'category',
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
    protect,
    authorize('apiUser'),
    advancedResults(Category, 'blog'),
    getCategories
  );

router
  .route('/category/:categoryId')
  .get(
    protect,
    authorize('apiUser'),
    advancedResults(Category, 'blog'),
    getBlogbyCategory
  )
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(protect, authorize('apiUser'), getBlog)
  .put(protect, authorize('moderator', 'admin'), updateBlog)
  .delete(protect, authorize('moderator', 'admin'), deleteBlog);

router.route('/:id/comments/:commentId').post(protect, createReply);
router.route('/:id/comments').post(protect, createComment);

module.exports = router;
