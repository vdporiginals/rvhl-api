const express = require('express');

const {
  getWebconfig,
  createWebconfig,
  updateWebconfig,
  deleteWebconfig,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} = require('../../controllers/web-config.controller');
const {
  getAuthorize,
  updateAuthorize,
} = require('../../controllers/authorize.controller');

const router = express.Router();
const Config = require('../../models/web-config.model');
const Authorize = require('../../models/authorization/authorize.model');
const Route = require('../../models/authorization/route.model');
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(
    protect,
    authorize('read', 'admin'),
    advancedResults(Config, null),
    getWebconfig
  )
  .post(protect, authorize('write', 'admin'), createWebconfig)
  .put(protect, authorize('write', 'admin'), updateWebconfig)
  .delete(protect, authorize('delete', 'admin'), deleteWebconfig);

router
  .route('/routes')
  .get(
    protect,
    authorize('read', 'admin'),
    advancedResults(Route, null),
    getRoutes
  )
  .post(protect, authorize('write', 'admin'), createRoute);

router
  .route('/routes/:id')
  .put(protect, authorize('write', 'admin'), updateRoute)
  .delete(protect, authorize('delete', 'admin'), deleteRoute);

router
  .route('/authorize')
  .get(
    protect,
    authorize('read', 'admin'),
    advancedResults(Authorize, null),
    getAuthorize
  )
  .put(protect, authorize('write', 'admin'), updateAuthorize);

module.exports = router;
