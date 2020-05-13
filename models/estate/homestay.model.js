const mongoose = require('mongoose');
const slug = require('../../config/slug');
const HomestaySchema = new mongoose.Schema({
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
  isPopular: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
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

HomestaySchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Homestay', HomestaySchema);
