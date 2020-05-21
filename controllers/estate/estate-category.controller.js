const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/estate/estateCategory.model');
const Hotel = require('../../models/estate/hotel.model');
const Homestay = require('../../models/estate/homestay.model');
const Villa = require('../../models/estate/villa.model');
const CheckRoom = require('../../models/estate/checkRoom.model');
const User = require('../../models/user.model');
//@desciption   Get all category
//@route        GET  /api/estates/categories
// @route     GET /api/estates/categories/:id
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   create estate category
//@route        POst  /api/estates/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new estate category`,
        400
      )
    );
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

//POST  /api/estates/check-room
exports.checkRoom = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.roomCategory);

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with id of ${req.body.roomCategory}`,
        404
      )
    );
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(
      new ErrorResponse(`Not authorized with id of ${req.user._id}`, 403)
    );
  }

  if (req.body.onEstate === 'Homestay') {
    const roomHomestay = await Homestay.findById(req.body.roomId);
    if (!roomHomestay) {
      return next(
        new ErrorResponse(`Not found room with id of ${req.body.roomId}`, 404)
      );
    }
  } else if (req.body.onEstate === 'Hotel') {
    const roomHotel = await Hotel.findById(req.body.roomId);
    if (!roomHotel) {
      return next(
        new ErrorResponse(`Not found room with id of ${req.body.roomId}`, 404)
      );
    }
  } else if (req.body.onEstate === 'Villa') {
    const roomVilla = await Villa.findById(req.body.roomId);
    if (!roomVilla) {
      return next(
        new ErrorResponse(`Not found room with id of ${req.body.roomId}`, 404)
      );
    }
  }

  req.body.user = req.user._id;

  const room = await CheckRoom.create(req.body);
  res.status(201).json({
    success: true,
    data: room._id,
  });
});

//Get api/estates/check-room
exports.getCheckRoom = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
//@desciption   Update estate category
//@route        PUT  /api/estates/categories/:id
//@access       Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

//@desciption   Delete estate category
//@route        DELETE  /api/estates/category/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${category._id}`,
        401
      )
    );
  }

  if (!category) {
    return next(
      new ErrorResponse(`category not found with id of ${req.params.id}`, 404)
    );
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
