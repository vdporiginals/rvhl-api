const mongoose = require('mongoose');
const slug = require('../../config/slug');
const AdvertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  keywords: String,
  link: {
    type: String,
  },
  page: {
    type: String,
    enum: ['tour', 'review', 'hotel', 'transfer', 'bannerTour', 'bannerReview', 'bannerHotel', 'bannerTransfer']
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  seo: String,
  status: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'AdvertiseCategory',
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

AdvertiseSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = mongoose.model('Advertise', AdvertiseSchema);