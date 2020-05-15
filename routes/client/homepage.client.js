const express = require('express');
const {
  getSliderAdvertise,
  getPopularReviews,
  getPopularTour,
  getPopularHotel,
  getPopularVilla,
  getPopularHomestay,
  getVideoBanner,
  getAdvertiseBanner,
} = require('../../controllers/homepage.controller');
const Blog = require('../../models/blog/blog.model');
const Tour = require('../../models/tour/tour.model');
const Advertise = require('../../models/advertise/advertise.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router.route('/slider').get(getSliderAdvertise);

router.route('/popular-review').get(getPopularReviews);

router.route('/popular-tour').get(getPopularTour);

router.route('/video-banner').get(getVideoBanner);

router.route('/advertise-banner').get(getAdvertiseBanner);

router.route('/popular-hotel').get(getPopularHotel);

router.route('/popular-villa').get(getPopularVilla);

router.route('/popular-homestay').get(getPopularHomestay);
module.exports = router;
