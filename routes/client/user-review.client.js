const express = require('express');
const {
  getUserReviews,
  getUserReview,
  createUserReview,
  updateUserReview,
  deleteUserReview,
} = require('../../controllers/userReviews/user-review.controller');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../../controllers/userReviews/user-review-category.controller');
const UserReview = require('../../models/userReviews/user-review.model');
const advancedResults = require('../../middleware/advancedResults');
const Category = require('../../models/userReviews/userReviewCategory.model');
const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), UserReviewPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(UserReview, [
      {
        path: 'user',
        select: 'name avatar description',
      },
      {
        path: 'commentsCount',
      },
      {
        path: 'replyCount',
      },
    ]),
    getUserReviews
  )
  .post(protect, authorize('moderator', 'admin'), createUserReview);

router
  .route('/category')
  .post(protect, authorize('moderator', 'admin'), createCategory)
  .get(advancedResults(Category, null), getCategories);

router
  .route('/category/:categoryId')
  .get(getCategory)
  .put(protect, authorize('moderator', 'admin'), updateCategory)
  .delete(protect, authorize('moderator', 'admin'), deleteCategory);

router
  .route('/:id')
  .get(getUserReview)
  .put(protect, authorize('moderator', 'admin'), updateUserReview)
  .delete(protect, authorize('moderator', 'admin'), deleteUserReview);

module.exports = router;
