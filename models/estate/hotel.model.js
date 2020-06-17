const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const HotelSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
  },
  content: String,
  roomNum: Number,
  isPopular: {
    type: Boolean,
    default: false,
  },
  address: String,
  views: String,
  images: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'EstateCategory',
  },
  facilities: {
    bed: String,
    square: Number,
    pool: Boolean,
    oceanViews: Boolean,
    restaurant: Boolean,
    meetingRoom: Boolean,
    other: [String],
  },
  image: String,
  showHomepage: Boolean,
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
    match: [
      /(09|03|02|08|07|05[0-9])+([0-9]{8,9}?)\b/g,
      'Hãy nhập đúng số điện thoại của bạn',
    ],
  },
  keywords: String,
  seo: String,
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

HotelSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);
