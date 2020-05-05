const express = require('express');
const {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} = require('../../controllers/transfer/transfer.controller');

const ModelTransfer = require('../../models/transfer/transfer.model');
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
  .get(advancedResults(ModelTransfer, null), getTransfers)
  .post(protect, authorize('admin', 'moderator'), createTransfer);

router
  .route('/:id')
  .get(protect, authorize('apiUser', 'admin'), getTransfer)
  .put(protect, authorize('admin', 'moderator'), updateTransfer)
  .delete(protect, authorize('admin', 'moderator'), deleteTransfer);

module.exports = router;