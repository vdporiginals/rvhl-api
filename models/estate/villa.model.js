const mongoose = require('mongoose');
const slug = require('../../config/slug');
const VillaSchema = new mongoose.Schema({
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
  services: { type: [String], required: true },
  isPopular: {
    type: Boolean,
    default: false,
  },
  content: String,
  address: String,
  views: String,
  images: {
    type: [String],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
  },
  facilities: {
    square: Number,
    pool: Boolean,
    oceanViews: Boolean,
    restaurant: Boolean,
    kitchen: Boolean,
    bbqArea: Boolean,
    other: [String],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'EstateCategory',
    required: true,
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

VillaSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Villa', VillaSchema);
