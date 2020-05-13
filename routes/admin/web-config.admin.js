const express = require('express');

const {
  getWebconfig,
  createWebconfig,
  updateWebconfig,
  deleteWebconfig,
} = require('../../controllers/web-config.controller');

const router = express.Router();
const Config = require('../../models/web-config.model');
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(advancedResults(Config, null), getWebconfig)
  .post(protect, authorize('admin'), createWebconfig)
  .put(protect, authorize('admin'), updateWebconfig)
  .delete(protect, authorize('admin'), deleteWebconfig);
module.exports = router;
