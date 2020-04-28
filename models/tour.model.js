const mongoose = require('mongoose');
const slug = require('../config/slug');

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add Title'],
  },
  schedule: [
    {
      timeStart: Date,
      timeEnd: Date,
      location: String,
      service: String,
    },
  ],
  description: String,
  phone: String,
  time: Date,
  price: { type: Number, required: [true, 'Please add price'] },
  category: {
    type: String,
    enum: ['Transfer', 'Hotel', 'Cruise', 'AllInOne'],
  },
  seo: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: false,
  },
  tourCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'TourCategory',
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
