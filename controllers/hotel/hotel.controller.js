const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Hotel = require('../../models/hotel/hotel.model');

//@desciption   Get all Hotel
//@route        GET  /api/Hotels
//@access       Public
exports.getHotels = asyncHandler(async (req, res, next) => {
  console.log(req);
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Hotel
//@route        GET  /api/Hotels/:id
//@access       Public
exports.getHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(
      new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: hotel,
  });
});

//@desciption   create Hotel
//@route        POST  /api/Hotels
//@access       Private
exports.createHotel = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  const hotel = await Hotel.create(req.body);

  if (!hotel) {
    return next(
      new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: hotel,
  });
});

//@desciption   Update Hotel
//@route        PUT  /api/Hotels/:id
//@access       Private
exports.updateHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!hotel) {
    return next(
      new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: Hotel
  });
});

//@desciption   Delete Hotel
//@route        DELETE  /api/Hotels/:id
//@access       Private
exports.deleteHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(
      new ErrorResponse(`Hotel not found with id of ${req.params.id}`, 404)
    );
  }

  hotel.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});