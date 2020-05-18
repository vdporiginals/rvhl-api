const mongoose = require('mongoose');
const slug = require('../../config/slug');
const HotelSchema = new mongoose.Schema({
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
    restaurant: Boolean,
    meetingRoom: Boolean,
    other: String,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
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
});

HotelSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);
