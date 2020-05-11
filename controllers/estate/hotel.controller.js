const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/estate/estateCategory.model');
const Hotel = require('../../models/estate/hotel.model');

//@desciption   Get all Hotel
//@route        GET  /estate/Hotels
//@access       Public
exports.getHotels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Hotel
//@route        GET  /estate/Hotels/:id
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
//@route        POST  /estate/Hotels
//@access       Private
exports.createHotel = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with id of ${req.body.category}`,
        404
      )
    );
  }

  const hotel = await Hotel.create(req.body);

  res.status(201).json({
    success: true,
    data: hotel._id,
  });
});

//@desciption   Update Hotel
//@route        PUT  /estate/Hotels/:id
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
    data: hotel._id,
  });
});

//@desciption   Delete Hotel
//@route        DELETE  /estate/Hotels/:id
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
    data: {},
  });
});
