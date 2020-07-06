const express = require('express');
const {
  getAdvertises,
  getAdvertise,
  createAdvertise,
  updateAdvertise,
  deleteAdvertise,
} = require('../../controllers/advertise/advertise.controller');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../../controllers/advertise/advertise-category.controller');
const Category = require('../../models/advertise/advertiseCategory.model');
const Advertise = require('../../models/advertise/advertise.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Advertise, null), getAdvertises)
  .post(protect, authorize('write', 'admin'), createAdvertise);

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
  .get(getAdvertise)
  .put(protect, authorize('write', 'admin'), updateAdvertise)
  .delete(protect, authorize('delete', 'admin'), deleteAdvertise);

module.exports = router;
