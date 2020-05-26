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
  },
  keywords: String,
  link: {
    type: String,
  },
  page: {
    type: String,
    enum: [
      'Homepage',
      'TourCruisePage',
      'TourAllPage',
      'TransferPage',
      'TourHalongPage',
      'SchedulePage',
      'Entertain',
      'FoodPage',
      'HotelPage',
      'HomestayPage',
      'VillaPage',
    ],
    required: [true, 'please add page position'],
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  video: String,
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
AdvertiseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.title, '-');
  next();
});

module.exports = mongoose.model('Advertise', AdvertiseSchema);
