const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategory,
  createComment,
  createReply,
} = require('../../controllers/blog.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/blog-category.controller');
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
router.route('/:id/comments/:commentId').post(protect, createReply);
router.route('/:id/comments').post(protect, createComment);

router
  .route('/category')
  .post(protect, authorize('moderator', 'admin'), createCategory)
  .get(
    protect,
    authorize('admin'),
    advancedResults(Category, 'tour'),
    getCategories
  );

router
  .route('/category/:id')
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

module.exports = router;
