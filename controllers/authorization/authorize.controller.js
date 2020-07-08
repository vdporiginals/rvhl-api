const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Authorize = require('../../models/authorization/authorize.model');
const Route = require('../../models/authorization/route.model');

exports.getAuthorize = asyncHandler(async (req, res, next) => {
  const authorize = await Authorize.findById(req.query.authorizeId);

  res.status(200).json({
    success: true,
    data: authorize,
  });
});

exports.updateAuthorize = asyncHandler(async (req, res, next) => {
  const routeAccept = req.body.routeAccept;
  let isValid;
  for (let i = 0; i < routeAccept.length; i++) {
    const route = await Route.findById(routeAccept[i]);
    if (!route) {
      isValid = false;
      break;
    }
  }

  if (isValid === false) {
    return next(new ErrorResponse(`Route not found`, 404));
  }

  const authorize = await Authorize.findByIdAndUpdate(
    req.query.authorizeId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: authorize._id,
  });
});
