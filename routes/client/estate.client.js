const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../../controllers/estate/hotel.controller');

const {
  getVillas,
  getVilla,
  createVilla,
  updateVilla,
  deleteVilla,
} = require('../../controllers/estate/villa.controller');

const {
  getHomestays,
  getHomestay,
  createHomestay,
  updateHomestay,
  deleteHomestay,
} = require('../../controllers/estate/homestay.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/estate/estate-category.controller');

const Homestay = require('../../models/estate/homestay.model');
const Villa = require('../../models/estate/villa.model');
const Hotel = require('../../models/estate/hotel.model');
const Estate = require('../../models/estate/estateCategory.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .update(protect, authorize('publisher', 'admin'), blogPhotoUpload);
router
  .route('/category')
  .get(advancedResults(Estate, null), getCategories)
  .post(protect, authorize('admin', 'moderator'), createCategory)
  .put(protect, authorize('admin', 'moderator'), updateCategory)
  .delete(protect, authorize('admin', 'moderator'), deleteCategory);

router
  .route('/category/villa')
  .get(advancedResults(Estate, null, 'Villa'), getCategories);

router
  .route('/category/homestay')
  .get(advancedResults(Estate, null, 'Homestay'), getCategories);

router
  .route('/category/hotel')
  .get(advancedResults(Estate, null, 'Hotel'), getCategories);

router
  .route('/hotel')
  .get(advancedResults(Hotel, null), getHotels)
  .post(protect, authorize('admin', 'moderator'), createHotel);

router
  .route('/hotel/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'moderator'), updateHotel)
  .delete(protect, authorize('admin', 'moderator'), deleteHotel);

router
  .route('/homestay')
  .get(advancedResults(Homestay, null), getHomestays)
  .post(protect, authorize('admin', 'moderator'), createHomestay);

router
  .route('/homestay/:id')
  .get(getHomestay)
  .put(protect, authorize('admin', 'moderator'), updateHomestay)
  .delete(protect, authorize('admin', 'moderator'), deleteHomestay);

router
  .route('/villa')
  .get(advancedResults(Villa, null), getVillas)
  .post(protect, authorize('admin', 'moderator'), createVilla);

router
  .route('/villa/:id')
  .get(getVilla)
  .put(protect, authorize('admin', 'moderator'), updateVilla)
  .delete(protect, authorize('admin', 'moderator'), deleteVilla);

module.exports = router;
