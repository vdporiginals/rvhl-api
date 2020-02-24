const express = require('express');
const {
  getAdvertises,
  getAdvertise,
  createAdvertise,
  updateAdvertise,
  deleteAdvertise
} = require('../../controllers/advertise.controller');

const Advertise = require('../../models/advertise.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Advertise, null), getAdvertises)
  .post(protect, authorize('admin'), createAdvertise);

router
  .route('/:id')
  .get(getAdvertise)
  .put(protect, authorize('admin'), updateAdvertise)
  .delete(protect, authorize('admin'), deleteAdvertise);

module.exports = router;
