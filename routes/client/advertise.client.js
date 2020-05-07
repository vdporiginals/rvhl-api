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
  getAdvertisebyCategory,
} = require('../../controllers/advertise/advertise-category.controller');
const Category = require('../../models/advertise/advertiseCategory.model');
const Advertise = require('../../models/advertise/advertise.model');
const advancedResults = require('../../middleware/advancedResults');

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

    advancedResults(Advertise, null),
    getAdvertises
  )
  .post(protect, authorize('admin'), createAdvertise);

router
  .route('/category')
  .post(protect, authorize('moderator', 'admin'), createCategory)
  .get(
    advancedResults(Category, 'position'),
    getCategories
  );

router
  .route('/category/:categoryId')
  .get(
    advancedResults(Category, 'position'),
    getAdvertisebyCategory
  )
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getAdvertise)
  .put(protect, authorize('admin'), updateAdvertise)
  .delete(protect, authorize('admin'), deleteAdvertise);

module.exports = router;