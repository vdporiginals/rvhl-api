const express = require('express');
const {
  getUserReviews,
  getUserReview,
  createUserReview,
  updateUserReview,
  deleteUserReview,
} = require('../../controllers/blog/user-review.controller');

const UserReview = require('../../models/user-review.model');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(UserReview), getUserReviews)
  .post(protect, authorize('admin'), createUserReview);

router
  .route('/:id')
  .get(protect, getUserReview)
  .put(protect, updateUserReview)
  .delete(protect, authorize('admin'), deleteUserReview);

module.exports = router;
