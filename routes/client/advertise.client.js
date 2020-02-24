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

// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Advertise, null), getAdvertises)
  .post(createAdvertise);

router
  .route('/:id')
  .get(getAdvertise)
  .put(updateAdvertise)
  .delete(deleteAdvertise);

module.exports = router;
