const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Category = require('../../models/advertise/advertiseCategory.model');
const Advertise = require('../../models/advertise/advertise.model');
//@desciption   Get all category
//@route        GET  /api/advertises/categories
// @route     GET /api/advertises/categories/:id
//@access       Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getAdvertisebyCategory = asyncHandler(async (req, res, next) => {
    let advertise = Advertise.find({
            category: req.params.categoryId
        })
        .populate({
            path: 'category',
            select: 'name',
        })

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        advertise = advertise.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        advertise = advertise.sort(sortBy);
    } else {
        advertise = advertise.sort('-createdAt');
    }

    const result = await advertise;
    // const total = await advertise.countDocuments(...req.query);
    return res.status(200).json({
        success: true,
        totalRecord: result.length,
        pagination,
        count: total,
        data: result,
    });
});

//@desciption   create advertise category
//@route        POst  /api/advertises/categories/:id
//@access       Public
exports.createCategory = asyncHandler(async (req, res, next) => {
    //add user to req.body
    req.body.user = req.user.id;

    if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `The user with ID ${req.user.id} has no permission to create new advertise category`,
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

//@desciption   Update Advertise category
//@route        PUT  /api/Advertises/categories/:id
//@access       Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        return next(
            new ErrorResponse(`category not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: category
    });
});

//@desciption   Delete Advertise category
//@route        DELETE  /api/Advertises/categories/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

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
        data: {}
    });
});