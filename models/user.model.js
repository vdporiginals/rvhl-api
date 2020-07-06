const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Authorize = require('../models/authorization/authorize.model');
const http = require('http');
const host = http.originalUrl;
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please add a name'],
    },
    email: {
      type: String,
      required: [true, 'please add a email'],
      unique: [true, 'Only one account per Email!'],
      match: [
        /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
        'Please add a valid email',
      ],
    },
    facebookId: String,
    googleId: String,
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    authorizeId: {
      type: String,
      ref: 'Authorize',
      required: true,
    },
    password: {
      type: String,
      required: [true, 'please add a password'],
      minlength: 6,
      select: false,
    },
    description: {
      type: String,
      maxlength: 100,
      default: 'Không có mô tả về User',
    },
    avatar: {
      type: String,
      default: `https://api.reviewhalong.vn/no-photo.jpg`,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

//Encrypt pass
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      authorizeId: this.authorizeId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_USER_EXPIRE,
    }
  );
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateDefaultAuthorize = async function (data) {
  let authorize;
  if (data !== null) {
    authorize = await Authorize.create(data);
  } else {
    authorize = await Authorize.create();
  }
  return authorize;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.getUserById = function (id, callback) {
  User.findById(id, callback);
};

UserSchema.methods.getUserByUsername = function (username, callback) {
  var query = {
    username: username,
  };
  User.findOne(query, callback);
};

module.exports = mongoose.model('User', UserSchema);
