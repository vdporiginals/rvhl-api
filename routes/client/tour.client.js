const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourCategory,
} = require('../../controllers/tour.controller');

const Tour = require('../../models/tour.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Tour, {
      path: 'user',
      select: 'name avatar description',
    }),
    getTours
  )
  .post(protect, authorize('moderator', 'admin'), createTour);

router.route('/category').get(getTourCategory);

router
  .route('/:id')
  .get(getTour)
  .put(protect, authorize('moderator', 'admin'), updateTour)
  .delete(protect, authorize('moderator', 'admin'), deleteTour);

module.exports = router;
