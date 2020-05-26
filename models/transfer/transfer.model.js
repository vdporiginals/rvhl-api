const mongoose = require('mongoose');
const slug = require('../../config/slug');

const TransferSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
  },
  description: {
    type: String,
  },
  locationStart: String,
  locationEnd: String,
  timeStart: Date,
  timePerTrip: String,
  content: String,
  chairNum: String,
  price: Number,
  keywords: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'TransferCategory',
    required: true,
  },
  schedule: [
    {
      _id: false,
      time: Date,
      location: String,
    },
  ],
  images: {
    type: [String],
    default: 'no-photo.jpg',
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
  },
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

TransferSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Transfer', TransferSchema);
