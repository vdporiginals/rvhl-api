const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Restaurant = require('../../models/restaurant/restaurant.model');

//@desciption   Get all Restaurant
//@route        GET  /api/Restaurants
//@access       Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Restaurant
//@route        GET  /api/Restaurants/:id
//@access       Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id).populate({
    path: 'category',
    select: 'name',
  });

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

//@desciption   create Restaurant
//@route        POST  /api/Restaurants
//@access       Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;

  const restaurant = await Restaurant.create(req.body);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: restaurant._id,
  });
});

//@desciption   Update Restaurant
//@route        PUT  /api/Restaurants/:id
//@access       Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant._id,
  });
});

//@desciption   Delete Restaurant
//@route        DELETE  /api/Restaurants/:id
//@access       Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  restaurant.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
