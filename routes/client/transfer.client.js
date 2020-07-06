const express = require('express');
const {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} = require('../../controllers/transfer/transfer.controller');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/transfer/transfer-category.controller');
const Transfer = require('../../models/transfer/transfer.model');
const Category = require('../../models/transfer/transferCategory.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .update(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Transfer, null), getTransfers)
  .post(protect, authorize('write', 'admin', 'moderator'), createTransfer);

router
  .route('/category')
  .get(advancedResults(Category, null), getCategories)
  .post(protect, authorize('write', 'admin', 'moderator'), createCategory);

router
  .route('/:transferId')
  .get(getTransfer)
  .delete(protect, authorize('delete', 'admin', 'moderator'), deleteTransfer)
  .put(protect, authorize('write', 'admin', 'moderator'), updateTransfer);

router
  .route('/category/:categoryId')
  .put(protect, authorize('write', 'admin', 'moderator'), updateCategory)
  .delete(protect, authorize('delete', 'admin', 'moderator'), deleteCategory)
  .get(getCategory);

module.exports = router;
