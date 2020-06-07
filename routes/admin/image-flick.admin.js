const express = require('express');

const {
  authFlickr,
  verifyToken,
  createGallery,
} = require('../../controllers/image-flick.controller');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

router.route('/auth').get(authFlickr);
//   .post(protect, authorize('admin'), verifyToken);

router.route('/oauth').get(verifyToken);

router.route('/gallery').post(protect, createGallery);
module.exports = router;
