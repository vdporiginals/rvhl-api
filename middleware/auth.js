const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('./utils/errorResponse');
const User = require('../models/user.model');
const Authorize = require('../models/authorization/authorize.model');
const Route = require('../models/authorization/route.model');

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
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    req.user.role = await decoded.role;
    req.user._id = await decoded.id;
    req.user.reqPath = req.baseUrl.replace('/api', '');
    req.user.authorizeId = await decoded.authorizeId;
    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

//Grant access to specific role
exports.authorize = (perm, ...roles) => {
  return asyncHandler(async (req, res, next) => {
    const authorization = await Authorize.findById(req.user.authorizeId);
    const routeAccept = await Route.find({ path: req.user.reqPath });
    console.log(req.user.reqPath);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    //Check user authorize is exists
    if (!authorization) {
      return next(
        new ErrorResponse(`User is not authorized to access this route`, 403)
      );
    }

    //Check user route accept
    console.log(authorization.routeAccept, routeAccept);
    if (
      !authorization.routeAccept.includes(routeAccept._id || []) &&
      req.user.role !== 'admin' &&
      req.user.reqPath !== '/web-config'
    ) {
      return next(
        new ErrorResponse(`User is not authorized to access this route`, 403)
      );
    }

    //Check user permission
    if (authorization.permission !== 'delete' && req.user.role !== 'admin') {
      if (
        authorization.permission === 'read' &&
        authorization.permission !== perm
      ) {
        return next(
          new ErrorResponse(
            `User is not have permission to access this route`,
            403
          )
        );
      }
    }

    next();
  });
};
