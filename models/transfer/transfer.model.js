const mongoose = require('mongoose');
const slug = require('../../config/slug');

const TransferSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  link: {
    type: String,
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone']
  },
  seo: String,
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

TransferSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = mongoose.model('Transfer', TransferSchema);