const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../../controllers/restaurant/restaurant.controller');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../../controllers/restaurant/restaurant-category.controller');
const Category = require('../../models/restaurant/restaurantCategory.model');
const Restaurant = require('../../models/restaurant/restaurant.model');
const advancedResults = require('../../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route('/')
  .get(advancedResults(Restaurant, null), getRestaurants)
  .post(protect, authorize('admin'), createRestaurant);

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
  .get(getRestaurant)
  .put(protect, authorize('admin'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant);

module.exports = router;
