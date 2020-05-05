const mongoose = require('mongoose');
const slug = require('../../config/slug');
const HotelSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  link: {
    type: String,
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  keywords: String,
  seo: String,
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

HotelSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);