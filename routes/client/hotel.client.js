const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../../controllers/hotel/hotel.controller');

const Hotel = require('../../models/hotel/hotel.model');
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
    advancedResults(Hotel, null),
    getHotels
  )
  .post(protect, authorize('admin', 'moderator'), createHotel);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'moderator'), updateHotel)
  .delete(protect, authorize('admin', 'moderator'), deleteHotel);

module.exports = router;