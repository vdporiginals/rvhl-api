const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const TransferSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
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
  timeStart: String,
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
      locationStart: String,
      locationEnd: String,
      price: String,
    },
  ],
  image: String,
  images: {
    type: [String],
    default: 'no-photo.jpg',
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
    match: [
      /(09|03|02|08|07|05[0-9])+([0-9]{8,9})\b/g,
      'Hãy nhập đúng số điện thoại của bạn',
    ],
  },
  seo: String,
  status: {
    type: Boolean,
    default: false,
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

TransferSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Transfer', TransferSchema);
