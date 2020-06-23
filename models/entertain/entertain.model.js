const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const EntertainSchema = new mongoose.Schema(
  {
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
    },
    price: String,
    content: String,
    address: String,
    image: String,
    images: {
      type: [String],
    },
    video: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'EntertainCategory',
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone'],
      match: [
        /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g,
        'Hãy nhập đúng số điện thoại của bạn',
      ],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    keywords: String,
    seo: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

EntertainSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Entertain', EntertainSchema);
