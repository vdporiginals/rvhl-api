const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user.model');
const randomstring = require('randomstring');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     POST /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: user.name,
  });
};

exports.loginStrategy = asyncHandler(async (req, res, next) => {
  sendTokenResponse(req.user, 200, res);
});

exports.fbStrategy = async function (accessToken, refreshToken, profile, done) {
  const isDuplicate = await User.findOne(
    { email: profile.emails[0].value },
    function (err, user) {
      return user;
    }
  );

  if (
    isDuplicate &&
    (Object.values(isDuplicate.facebook)[1] == undefined ||
      Object.values(isDuplicate.facebook)[2] == undefined)
  ) {
    const fbJson = await {
      id: profile.id,
      token: accessToken,
      name: profile.displayName,
    };

    const uptFbUser = await User.findByIdAndUpdate(isDuplicate.id, {
      $set: {
        facebook: fbJson,
      },
    });

    return done(null, uptFbUser);
  } else {
    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
      if (err) return done(err);
      if (user) return done(null, user);
      else {
        const randomPassword = randomstring.generate({
          length: 12,
          charset: 'alphabetic',
        });

        let newUser = new User({
          name: profile.displayName,
          password: randomPassword,
          randomPassword,
          facebook: {
            id: profile.id,
            token: accessToken,
            name: profile.displayName,
          },
          avatar: profile.photos[0].value,
        });

        if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
          newUser.email = profile.emails[0].value;

        // save our user to the database
        newUser.save(function (err) {
          if (err) return done(null, new ErrorResponse(err.errmsg, 400));
          return done(null, newUser);
        });
      }
    });
  }
};

exports.googleStrategy = async function (
  accessToken,
  refreshToken,
  profile,
  done
) {
  const isDuplicate = await User.findOne(
    { email: profile.emails[0].value },
    function (err, user) {
      return user;
    }
  );

  if (
    isDuplicate &&
    (Object.values(isDuplicate.google)[1] == undefined ||
      Object.values(isDuplicate.google)[2] == undefined)
  ) {
    const googleJson = await {
      id: profile.id,
      token: accessToken,
      name: profile.displayName,
    };

    const uptUser = await User.findByIdAndUpdate(isDuplicate.id, {
      $set: {
        google: googleJson,
      },
    });

    return done(null, uptUser);
  } else {
    User.findOne({ 'google.id': profile.id }, function (err, user) {
      if (err) return done(err);
      if (user) return done(null, user);
      else {
        // if there is no user found with that facebook id, create them
        const randomPassword = randomstring.generate({
          length: 12,
          charset: 'alphabetic',
        });

        let newUser = new User({
          name: profile.displayName,
          password: randomPassword,
          randomPassword,
          email: profile.emails[0].value,
          google: {
            id: profile.id,
            token: accessToken,
            name: profile.displayName,
          },
          avatar: profile._json.picture,
        });

        newUser.save(function (err) {
          if (err) return done(new ErrorResponse(err.errmsg, 400), null);
          return done(null, newUser);
        });
      }
    });
  }
};
