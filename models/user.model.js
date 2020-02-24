const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name']
  },
  email: {
    type: String,
    required: [true, 'please add an email'],
    unique: [true, 'Only one account per Email!'],
    match: [
      /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please add a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: 'no-photo.jpg'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Encrypt pass
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT
UserSchema.methods.signedJWT = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//compare enter password is in database
UserSchema.methods.comparePassword = async function(enteredPw) {
  return await bcrypt.compare(enteredPw, this.password);
};

module.exports = mongoose.model('User', UserSchema);
