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
      path: 'user',
      select: 'name avatar description',
    }),
    getTours
  )
  .post(protect, authorize('moderator', 'admin'), createTour);

router
  .route('/:id')
  .get(protect, authorize('admin'), getTour)
  .put(protect, authorize('moderator', 'admin'), updateTour)
  .delete(protect, authorize('moderator', 'admin'), deleteTour);

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
