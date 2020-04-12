const mongoose = require('mongoose');
const slug = require('../config/slug');

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add Title'],
  },
  schedule: {
    timeStart: Date,
    timeEnd: Date,
    location: String,
  },
  description: String,
  phone: String,
  time: Date,
  price: { type: Number, required: [true, 'Please add price'] },
  services: {
    type: [String],
  },
  category: {
    type: String,
    enum: ['Transfer', 'Hotel', 'Bay', 'AllInOne'],
  },
  seo: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  images: {
    type: [String],
    default: 'no-photo.jpg',
  },
});

TourSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = new mongoose.model('Tour', TourSchema);
