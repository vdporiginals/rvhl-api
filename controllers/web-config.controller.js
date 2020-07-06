const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Webconfig = require('../models/web-config.model');
const Route = require('../models/authorization/route.model');

//@desciption   get config
//@route        get  /api/client-config
//@access       Private
exports.getWebconfig = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.createWebconfig = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  const config = await Webconfig.create(req.body);

  res.status(201).json({
    success: true,
    data: config._id,
  });
});

exports.updateWebconfig = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  const config = await Webconfig.findByIdAndUpdate('webconfig1', req.body, {
    new: true,
    runValidators: true,
  });

  if (!config) {
    return next(
      new ErrorResponse(`config not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: config._id,
  });
});

exports.deleteWebconfig = asyncHandler(async (req, res, next) => {
  const config = await Webconfig.findById('webconfig1');

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new tour`,
        400
      )
    );
  }

  if (!config) {
    return next(
      new ErrorResponse(`config not found with id of ${req.params.id}`, 404)
    );
  }

  config.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get all routes
// @route     GET /api/web-config/routes
// @access    Private/Admin
exports.getRoutes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Create route
// @route     POST /api/web-config/routes
// @access    Private/Admin
exports.createRoute = asyncHandler(async (req, res, next) => {
  const route = await Route.create(req.body);

  res.status(201).json({
    success: true,
    data: route.routeId,
  });
});

// @desc      Update route
// @route     PUT /api/web-config/routes/:id
// @access    Private/Admin
exports.updateRoute = asyncHandler(async (req, res, next) => {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: route.routeId,
  });
});

// @desc      Delete route
// @route     DELETE /api/web-config/routes/:id
// @access    Private/Admin
exports.deleteRoute = asyncHandler(async (req, res, next) => {
  await Route.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
