const express = require('express');

const {
  authFlickr,
  uploadPhotos,
  verifyToken,
  createGallery,
  getListPhoto,
  getPhotos,
  getListGallery,
} = require('../../controllers/image-flick.controller');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

router.route('/auth').get(authFlickr);
//   .post(protect, authorize('admin'), verifyToken);

router.route('/oauth').get(verifyToken);

router
  .route('/gallery')
  .get(protect, getListGallery)
  .post(protect, createGallery);
router.route('/gallery/:id').post(protect, createGallery);

router.route('/photos').get(protect, getListPhoto).post(protect, uploadPhotos);
router.route('/photos/:id').get(protect, getPhotos);
module.exports = router;
