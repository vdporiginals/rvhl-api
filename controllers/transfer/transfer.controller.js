const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Transfer = require('../../models/transfer/transfer.model');
const Category = require('../../models/transfer/transferCategory.model');

//@desciption   Get all Transfer
//@route        GET  /api/Transfers
//@access       Public
exports.getTransfers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desciption   Get single Transfer
//@route        GET  /api/Transfers/:id
//@access       Public
exports.getTransfer = asyncHandler(async (req, res, next) => {
  const transfer = await Transfer.findById(req.params.transferId);

  if (!transfer) {
    return next(
      new ErrorResponse(`Transfer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: transfer,
  });
});

//@desciption   create Transfer
//@route        POST  /api/Transfers
//@access       Private
exports.createTransfer = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  const transfer = await Transfer.create(req.body);

  res.status(201).json({
    success: true,
    data: transfer._id,
  });
});

//@desciption   Update Transfer
//@route        PUT  /api/Transfers/:id
//@access       Private
exports.updateTransfer = asyncHandler(async (req, res, next) => {
  const transfer = await Transfer.findByIdAndUpdate(
    req.params.transferId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!transfer) {
    return next(
      new ErrorResponse(
        `Transfer not found with id of ${req.params.transferId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: transfer._id,
  });
});

//@desciption   Delete Transfer
//@route        DELETE  /api/Transfers/:id
//@access       Private
exports.deleteTransfer = asyncHandler(async (req, res, next) => {
  const transfer = await Transfer.findById(req.params.id);

  if (!transfer) {
    return next(
      new ErrorResponse(`Transfer not found with id of ${req.params.id}`, 404)
    );
  }

  transfer.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
