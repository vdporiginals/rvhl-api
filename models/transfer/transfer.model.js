const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const TransferSchema = new mongoose.Schema(
  {
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
        /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g,
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
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

TransferSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Transfer', TransferSchema);
