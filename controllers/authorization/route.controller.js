// const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Route = require('../../models/authorization/route.model');

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

  if (!route) {
    return next(
      new ErrorResponse(`Route not found with id of ${req.params.id}`, 404)
    );
  }

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
