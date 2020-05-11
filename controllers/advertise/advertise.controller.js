const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Advertise = require('../../models/advertise/advertise.model');

//@desciption   Get all advertise
//@route        GET  /api/advertises
//@access       Public
exports.getAdvertises = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single advertise
//@route        GET  /api/advertises/:id
//@access       Public
exports.getAdvertise = asyncHandler(async (req, res, next) => {
  const advertise = await Advertise.findById(req.params.id);

  if (!advertise) {
    return next(
      new ErrorResponse(`Advertise not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: advertise,
  });
});

//@desciption   create advertise
//@route        POST  /api/advertises
//@access       Private
exports.createAdvertise = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  const advertise = await Advertise.create(req.body);

  if (!advertise) {
    return next(
      new ErrorResponse(`advertise not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: advertise._id,
  });
});

//@desciption   Update advertise
//@route        PUT  /api/advertises/:id
//@access       Private
exports.updateAdvertise = asyncHandler(async (req, res, next) => {
  const advertise = await Advertise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!advertise) {
    return next(
      new ErrorResponse(`advertise not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: advertise._id,
  });
});

//@desciption   Delete advertise
//@route        DELETE  /api/advertises/:id
//@access       Private
exports.deleteAdvertise = asyncHandler(async (req, res, next) => {
  const advertise = await Advertise.findById(req.params.id);

  if (!advertise) {
    return next(
      new ErrorResponse(`advertise not found with id of ${req.params.id}`, 404)
    );
  }

  advertise.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
