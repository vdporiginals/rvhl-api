const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/user.controller');

const User = require('../../models/user.model');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(protect, authorize('read', 'admin'), advancedResults(User), getUsers)
  .post(protect, authorize('write', 'admin'), createUser);

router
  .route('/:id')
  .get(protect, authorize('read', 'admin'), getUser)
  .put(protect, authorize('write', 'admin'), updateUser)
  .delete(protect, authorize('delete', 'admin'), deleteUser);

module.exports = router;
