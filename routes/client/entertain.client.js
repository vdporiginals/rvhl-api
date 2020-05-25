const express = require('express');
const {
  getEntertains,
  getEntertain,
  createEntertain,
  updateEntertain,
  deleteEntertain,
} = require('../../controllers/entertain/entertain.controller');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../../controllers/entertain/entertain-category.controller');
const Category = require('../../models/entertain/entertainCategory.model');
const Entertain = require('../../models/entertain/entertain.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Entertain, null), getEntertains)
  .post(protect, authorize('admin'), createEntertain);

router
  .route('/category')
  .post(protect, authorize('moderator', 'admin'), createCategory)
  .get(advancedResults(Category, null), getCategories);

router
  .route('/category/:categoryId')
  .get(getCategory)
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getEntertain)
  .put(protect, authorize('admin'), updateEntertain)
  .delete(protect, authorize('admin'), deleteEntertain);

module.exports = router;
