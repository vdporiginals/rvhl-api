const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../../controllers/tour.controller');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/tour-category.controller');
const Tour = require('../../models/tour.model');
const Category = require('../../models/tourCategory.model');
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
    advancedResults(Tour, {
      path: 'category',
      select: 'name',
    }),
    getTours
  )
  .post(protect, authorize('moderator', 'admin'), createTour);

router
  .route('/category')
  .get(
    protect,
    authorize('admin'),
    advancedResults(Category, 'tour'),
    getCategories
  )
  .post(protect, authorize('moderator', 'admin'), createCategory);

router
  .route('/category/:id')
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(protect, authorize('admin'), getTour)
  .put(protect, authorize('moderator', 'admin'), updateTour)
  .delete(protect, authorize('moderator', 'admin'), deleteTour);

module.exports = router;
