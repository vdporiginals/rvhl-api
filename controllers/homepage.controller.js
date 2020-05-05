const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AdvertiseCategory = require('../models/advertise/advertiseCategory.model');
const Advertise = require('../models/advertise/advertise.model');
const Tour = require('../models/tour/tour.model');
const Blog = require('../models/blog/blog.model');
//@route        GET  //api/homepage/slider
//@access       Public
exports.getSliderAdvertise = asyncHandler(async (req, res, next) => {
    AdvertiseCategory.find({
        position: 'slider'
    }).then(async (val) => {
        let slider = Advertise.find({
            category: val._id
        });

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            slider = slider.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            slider = slider.sort(sortBy);
        } else {
            slider = slider.sort('-createdAt'); //get lastest
        }

        const result = await slider;
        return res.status(200).json({
            success: true,
            data: result,
        });
    });
});

//@route        GET  /api/homepage/popular-tour
//@access       Public
exports.getPopupularTour = asyncHandler(async (req, res, next) => {
    let popular = Tour.find({
        isPopular: true
    });
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        popular = popular.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        popular = popular.sort(sortBy);
    } else {
        popular = popular.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await popular.countDocuments(popular);
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    const result = await popular;
    return res.status(200).json({
        success: true,
        totalRecord: result.length,
        pagination,
        count: total,
        data: result,
    });
});

//@route        GET  //api/homepage/review
//@access       Public
exports.getPopularReviews = asyncHandler(async (req, res, next) => {
    let popular = Blog.find({
        isPopular: true
    });
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        popular = popular.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        popular = popular.sort(sortBy);
    } else {
        popular = popular.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await popular.countDocuments(popular);
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    const result = await popular;
    return res.status(200).json({
        success: true,
        totalRecord: result.length,
        pagination,
        count: total,
        data: result,
    });
});

//@route        GET  /api/homepage/video-banner
//@access       Public
exports.getVideoBanner = (async (req, res, next) => {
    AdvertiseCategory.find({
        position: 'video'
    }).then(async (val) => {
        let banner = Advertise.find({
            category: val._id
        });

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            banner = banner.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            banner = banner.sort(sortBy);
        } else {
            banner = banner.sort('-createdAt'); //get lastest
        }

        const result = await banner;
        return res.status(200).json({
            success: true,
            data: result,
        });
    });
});

//@route        GET  /api/homepage/advertise-banner
//@access       Public
exports.getAdvertiseBanner = asyncHandler(async (req, res, next) => {
    AdvertiseCategory.find({
        position: 'bannerAdvertise'
    }).then(async (val) => {
        let banner = Advertise.find({
            category: val._id
        });

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            banner = banner.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            banner = banner.sort(sortBy);
        } else {
            banner = banner.sort('-createdAt'); //get lastest
        }
        const result = await banner;
        return res.status(200).json({
            success: true,
            data: result,
        });
    });
});