const express = require('express');
const {
    getSliderAdvertise,
    getPopularReviews,
    getPopupularTour,
    getVideoBanner,
    getAdvertiseBanner,
} = require('../../controllers/homepage.controller');
const Blog = require('../../models/blog/blog.model');
const Tour = require('../../models/tour/tour.model');
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
    .route('/slider')
    .get(
        protect,
        authorize('apiUser', 'admin'),
        getSliderAdvertise
    )

router
    .route('/popular-review')
    .get(
        protect,
        authorize('apiUser', 'admin'),
        getPopularReviews
    )

router
    .route('/popular-tour')
    .get(
        protect,
        authorize('apiUser', 'admin'),
        getPopupularTour
    )

router
    .route('/video-banner')
    .get(
        protect,
        authorize('apiUser', 'admin'),
        getVideoBanner
    )

router
    .route('/advertise-banner')
    .get(
        protect,
        authorize('apiUser', 'admin'),
        getAdvertiseBanner
    )
module.exports = router;