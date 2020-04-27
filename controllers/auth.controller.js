const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user.model');
const randomstring = require('randomstring');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);
const request = require('request');

exports.authApp = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const appId = req.params.appId;
  const user = await User.findOne({ email }).select('+password');
  if (appId !== process.env.ANGULAR_APPID && !user) {
    return next(new ErrorResponse('Not Authorized', 401));
  }

  sendTokenResponse(user, 200, res);
});

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

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetUrl}`;

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

exports.loginWithGoogle = asyncHandler(async (req, res, next) => {
  const social = req.body;
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience: process.env.GOOGLE_APP_ID,
  });
  const payload = ticket.getPayload();
  const googleUid = payload['sub'];

  if (googleUid !== social.socialData.google.id) {
    return next(
      new ErrorResponse('You must login with Google or Facebook', 400)
    );
  }

  const isDuplicate = await User.findOne(
    { email: social.socialData.google.email },
    function (err, user) {
      return user;
    }
  );

  if (isDuplicate && isDuplicate.googleId !== undefined) {
    const uptUser = await User.findByIdAndUpdate(isDuplicate.id, {
      $set: {
        googleId: social.socialData.google.id,
      },
    });
    sendTokenResponse(uptUser, 200, res);
  } else {
    User.findOne({ googleId: social.socialData.google.id }, function (
      err,
      user
    ) {
      if (err) return next(new ErrorResponse(err, err.status));
      if (user) sendTokenResponse(user, 200, res);
      else {
        // if there is no user found with that facebook id, create them
        const randomPassword = randomstring.generate({
          length: 12,
          charset: 'alphabetic',
        });

        let newUser = new User({
          name: social.socialData.google.name,
          password: randomPassword,
          email: social.socialData.google.email,
          googleId: social.socialData.google.id,
          avatar: social.socialData.google.avatar,
        });

        newUser.save(function (err) {
          if (err) return next(new ErrorResponse(err.errmsg, 400), null);
          sendTokenResponse(newUser, 200, res);
        });
      }
    });
  }
});

exports.loginWithFacebook = asyncHandler(async (req, res, next) => {
  const social = req.body;
  let isValid = false;
  request.get(
    `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}
    &client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`,
    function (err, res, body) {
      //nếu có lỗi
      if (err) throw err;
      const access = JSON.parse(body);

      request.get(
        `https://graph.facebook.com/debug_token?input_token=${social.token}
        &access_token=${access.access_token}`,
        async function (err, res, body) {
          //nếu có lỗi
          if (err) throw err;
          let data = JSON.parse(body);
          isValid = await data.data.is_valid;
          if (isValid !== true) {
            return next(
              new ErrorResponse('Not authorized to access this route', 401)
            );
          }
        }
      );
    }
  );
  console.log(social);
  if (social.socialData === undefined || social.socialData === null) {
    return next(new ErrorResponse('You must login with facebook', 400));
  }

  const isDuplicate = await User.findOne(
    { email: social.socialData.email },
    function (err, user) {
      return user;
    }
  );

  if (isDuplicate && isDuplicate.facebookId !== undefined) {
    const uptUser = await User.findByIdAndUpdate(isDuplicate.id, {
      $set: {
        facebookId: social.socialData.id,
      },
    });
    sendTokenResponse(uptUser, 200, res);
  } else {
    User.findOne({ facebookId: social.socialData.id }, function (err, user) {
      if (err) return next(new ErrorResponse(err, err.status));
      if (user) sendTokenResponse(user, 200, res);
      else {
        // if there is no user found with that facebook id, create them
        const randomPassword = randomstring.generate({
          length: 12,
          charset: 'alphabetic',
        });

        let newUser = new User({
          name: social.socialData.name,
          password: randomPassword,
          email: social.socialData.email,
          facebookId: social.socialData.id,
          avatar: social.socialData.picture.data.url,
        });

        newUser.save(function (err) {
          if (err) return next(new ErrorResponse(err.errmsg, 400), null);
          sendTokenResponse(newUser, 200, res);
        });
      }
    });
  }
});
