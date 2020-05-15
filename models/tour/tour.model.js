const mongoose = require('mongoose');
const slug = require('../../config/slug');

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add Title'],
  },
  keywords: String,
  schedule: [
    {
      _id: false,
      timeStart: Date,
      timeEnd: Date,
      location: String,
      service: String,
    },
  ],
  content: String,
  isPopular: {
    type: Boolean,
    default: false,
  },
  description: String,
  phone: String,
  customerNum: Number,
  time: String,
  price: {
    type: Number,
    required: [true, 'Please add price'],
  },
  seo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    enum: ['TourCruise', 'TourAll', 'TourHaLong'],
    required: [true, 'Please add a position'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'TourCategory',
  },
  address: String,
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
  this.schedule.sort(function (a, b) {
    return new Date(a.timeStart) - new Date(b.timeStart);
  });
  next();
});

module.exports = new mongoose.model('Tour', TourSchema);
