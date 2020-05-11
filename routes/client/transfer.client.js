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
  .route('/category')
  .get(advancedResults(Category, 'transfers'), getCategories)
  .post(protect, authorize('admin', 'moderator'), createCategory)
  .put(protect, authorize('admin', 'moderator'), updateCategory)
  .delete(protect, authorize('admin', 'moderator'), deleteCategory);

// router.route('/category/:categoryId').get(getCategory);

router
  .route('/transfer')
  .get(advancedResults(Transfer, null), getTransfers)
  .post(protect, authorize('admin', 'moderator'), createTransfer)
  .put(protect, authorize('admin', 'moderator'), updateTransfer)
  .delete(protect, authorize('admin', 'moderator'), deleteTransfer);

router.route('/transfer/:transferId').get(getTransfer);

module.exports = router;
