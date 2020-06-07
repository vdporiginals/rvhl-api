const express = require('express');

const {
  authFlickr,
  verifyToken,
} = require('../../controllers/image-flick.controller');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

router.route('/auth').get(protect, authorize('admin'), authFlickr);
//   .post(protect, authorize('admin'), verifyToken);

router.route('/oauth').get(verifyToken);
module.exports = router;
