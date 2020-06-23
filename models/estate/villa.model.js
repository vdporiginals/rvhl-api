const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const VillaSchema = new mongoose.Schema({
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
  roomNum: Number,
  services: { type: [String] },
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
    match: [
      /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g,
      'Hãy nhập đúng số điện thoại của bạn',
    ],
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
  image: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'EstateCategory',
    required: true,
  },
  showHomepage: Boolean,
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
    // default: Date.now,
  },
});

VillaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Villa', VillaSchema);
