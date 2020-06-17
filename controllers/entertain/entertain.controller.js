const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const geocoder = require('../../middleware/utils/geocoder');
const Entertain = require('../../models/entertain/entertain.model');
const Category = require('../../models/entertain/entertainCategory.model');
//@desciption   Get all Entertains
//@route        GET  /api/Entertains
//@access       Public
exports.getEntertains = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Entertain
//@route        GET  /api/Entertains/:id
//@access       Public
exports.getEntertain = asyncHandler(async (req, res, next) => {
  const entertain = await Entertain.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name avatar description email',
    })
    .populate({
      path: 'category',
      select: 'name',
    });

  if (!entertain) {
    return next(
      new ErrorResponse(`Entertain not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: entertain,
  });
});

//@desciption   create Entertain add category ID to body
//@route        POST  /api/Entertains
//@access       Private
exports.createEntertain = asyncHandler(async (req, res, next) => {
  //add user to req.body
  // req.body.category = req.params.categoryId;
  req.body.user = req.user.id;
  const category = await Category.findById(req.body.category);
  //   if (!category) {
  //     return next(
  //       new ErrorResponse(`No category with the id of ${req.params.categoryId}`),
  //       404
  //     );
  //   }

  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no permission to create new Entertain`,
        400
      )
    );
  }

  const entertain = await Entertain.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      _id: entertain._id,
    },
  });
});

//@desciption   Update Entertain
//@route        PUT  /api/Entertains/:id
//@access       Private
exports.updateEntertain = asyncHandler(async (req, res, next) => {
  //   const user = await Entertain.findById(req.params.id);
  // console.log()
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this Entertain`,
        401
      )
    );
  }

  const entertain = await Entertain.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!entertain) {
    return next(
      new ErrorResponse(`Entertain not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      _id: entertain._id,
    },
  });
});

//@desciption   Delete Entertain
//@route        DELETE  /api/Entertains/:id
//@access       Private
exports.deleteEntertain = asyncHandler(async (req, res, next) => {
  const entertain = await Entertain.findById(req.params.id);

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete entertain ${entertain._id}`,
        401
      )
    );
  }

  if (!entertain) {
    return next(
      new ErrorResponse(`Entertain not found with id of ${req.params.id}`, 404)
    );
  }

  entertain.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
