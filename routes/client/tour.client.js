const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../../controllers/tour/tour.controller');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTourbyCategory,
} = require('../../controllers/tour/tour-category.controller');
const Tour = require('../../models/tour/tour.model');
const Category = require('../../models/tour/tourCategory.model');
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
    advancedResults(Category, null),
    getCategories
  )
  .post(protect, authorize('moderator', 'admin'), createCategory);

router
  .route('/category/:categoryId')
  .get(
    getTourbyCategory
  )
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getTour)
  .put(protect, authorize('moderator', 'admin'), updateTour)
  .delete(protect, authorize('moderator', 'admin'), deleteTour);

module.exports = router;