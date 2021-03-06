const path = require('path');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AdvertiseCategory = require('../models/advertise/advertiseCategory.model');
const Advertise = require('../models/advertise/advertise.model');
const Tour = require('../models/tour/tour.model');
const Blog = require('../models/blog/blog.model');
const Hotel = require('../models/estate/hotel.model');
const Villa = require('../models/estate/villa.model');
const Homestay = require('../models/estate/homestay.model');
//@route        GET  //api/homepage/slider
//@access       Public
exports.getSliderAdvertise = asyncHandler(async (req, res, next) => {
  const advCat = await AdvertiseCategory.find({
    position: 'slider',
  });

  if (!advCat) {
    return next(new ErrorResponse(`Cannot found category`, 404));
  }

  let slider = Advertise.find({
    category: advCat[0]._id,
    pagePosition: 'Homepage',
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

//@route        GET  /api/homepage/popular-tour
//@access       Public
exports.getPopularTour = asyncHandler(async (req, res, next) => {
  let query;
  req.query.isPopular = true;

  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Tour.find(JSON.parse(queryStr));

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  query = query.limit(limit);
  const result = await query;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    data: result,
  });
});

exports.getPopularHotel = asyncHandler(async (req, res, next) => {
  let query;
  req.query.isPopular = true;
  req.query.status = true;
  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Hotel.find(JSON.parse(queryStr));
  const limit = parseInt(req.query.limit, 10) || 25;

  query = query.limit(limit);
  const result = await query;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    data: result,
  });
});

exports.getPopularVilla = asyncHandler(async (req, res, next) => {
  let query;
  req.query.isPopular = true;
  req.query.status = true;
  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Villa.find(JSON.parse(queryStr));
  const limit = parseInt(req.query.limit, 10) || 25;

  query = query.limit(limit);
  const result = await query;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    data: result,
  });
});

exports.getPopularHomestay = asyncHandler(async (req, res, next) => {
  let query;
  req.query.isPopular = true;
  req.query.status = true;
  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Homestay.find(JSON.parse(queryStr));
  const limit = parseInt(req.query.limit, 10) || 25;

  query = query.limit(limit);
  const result = await query;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    data: result,
  });
});

exports.getPopularEstate = asyncHandler(async (req, res, next) => {
  let hotel = Hotel.find({
    showHomepage: true,
  });
  let homestay = Homestay.find({ showHomepage: true });
  let villa = Villa.find({ showHomepage: true });
  (await hotel).concat(homestay, villa);
  const limit = parseInt(req.query.limit, 10) || 25;

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    hotel = hotel.sort(sortBy);
    homestay = homestay.sort(sortBy);
    villa = villa.sort(sortBy);
  } else {
    hotel = hotel.sort('-createdAt');
    homestay = homestay.sort('-createdAt');
    villa = villa.sort('-createdAt');
  }

  hotel.limit(limit);
  homestay.limit(limit);
  villa.limit(limit);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    hotel = hotel.select(fields);
    homestay = homestay.select(fields);
    villa = villa.select(fields);
  }
  const result1 = await hotel;
  const result2 = await homestay;
  const result3 = await villa;
  return res.status(200).json({
    success: true,
    total: result1.length + result3.length + result2.length,
    data: result1.concat(result2).concat(result3),
  });
});
//@route        GET  //api/homepage/review
//@access       Public
exports.getPopularReviews = asyncHandler(async (req, res, next) => {
  let query;
  req.query.isPopular = true;

  //copy req.query
  const reqQuery = {
    ...req.query,
  };

  //field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']; //pageNum and pageSize

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Blog.find(JSON.parse(queryStr));

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  query = query.limit(limit);
  const result = await query;
  return res.status(200).json({
    success: true,
    totalRecord: result.length,
    data: result,
  });
});

//@route        GET  /api/homepage/video-banner
//@access       Public
exports.getVideoBanner = async (req, res, next) => {
  const advCat = await AdvertiseCategory.find({
    position: 'video',
  });

  if (!advCat) {
    return next(new ErrorResponse(`Cannot found category`, 404));
  }
  let banner = Advertise.find({
    category: advCat[0]._id,
    pagePosition: 'Homepage',
  });
  const limit = parseInt(req.query.limit, 10) || 25;

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
  banner.limit(limit);
  const result = await banner;
  return res.status(200).json({
    success: true,
    data: result,
  });
};

//@route        GET  /api/homepage/advertise-banner
//@access       Public
exports.getAdvertiseBanner = asyncHandler(async (req, res, next) => {
  const advCat = await AdvertiseCategory.find({
    position: 'HomepageAdvertise',
  });
  if (!advCat) {
    return next(new ErrorResponse(`Cannot found category`, 404));
  }
  let banner = Advertise.find({
    category: advCat[0]._id,
    pagePosition: 'Homepage',
  });
  const limit = parseInt(req.query.limit, 10) || 25;

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
  banner.limit(limit);
  const result = await banner;
  return res.status(200).json({
    success: true,
    data: result,
  });
});
