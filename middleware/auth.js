const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('./utils/errorResponse');
const User = require('../models/user.model');

//Proteced routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //check  token
  if (!token) {
    console.log(123123);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.role);
    req.user = await User.findById(decoded.id);
    console.log(req.user);
    req.user.role = await decoded.role;
    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

//Grant access to specific role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
