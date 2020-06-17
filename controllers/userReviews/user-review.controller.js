const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const geocoder = require('../../middleware/utils/geocoder');
const UserReview = require('../../models/userReviews/user-review.model');
const Category = require('../../models/userReviews/userReviewCategory.model');
//@desciption   Get all UserReviews
//@route        GET  /api/UserReviews
//@access       Public
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single UserReview
//@route        GET  /api/UserReviews/:id
//@access       Public
exports.getUserReview = asyncHandler(async (req, res, next) => {
  const userReview = await UserReview.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name avatar description email',
    })
    .populate({
      path: 'category',
      select: 'name',
    });

  if (!userReview) {
    return next(
      new ErrorResponse(`UserReview not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: userReview,
  });
});

//@desciption   create UserReview add category ID to body
//@route        POST  /api/UserReviews
//@access       Private
exports.createUserReview = asyncHandler(async (req, res, next) => {
  //add user to req.body
  // req.body.category = req.params.categoryId;
  req.body.user = req.user.id;
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.categoryId}`),
      404
    );
  }

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new UserReview`,
        400
      )
    );
  }

  const userReview = await UserReview.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      _id: userReview._id,
    },
  });
});

//@desciption   Update UserReview
//@route        PUT  /api/UserReviews/:id
//@access       Private
exports.updateUserReview = asyncHandler(async (req, res, next) => {
  const user = await UserReview.findById(req.params.id);

  if (user.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this UserReview ${user._id}`,
        401
      )
    );
  }

  const userReview = await UserReview.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!userReview) {
    return next(
      new ErrorResponse(`UserReview not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      _id: userReview._id,
    },
  });
});

//@desciption   Delete UserReview
//@route        DELETE  /api/UserReviews/:id
//@access       Private
exports.deleteUserReview = asyncHandler(async (req, res, next) => {
  const userReview = await UserReview.findById(req.params.id);

  if (
    userReview.user.toString() !== req.user._id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  if (!userReview) {
    return next(
      new ErrorResponse(`UserReview not found with id of ${req.params.id}`, 404)
    );
  }

  userReview.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
