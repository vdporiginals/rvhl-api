const mongoose = require('mongoose');
const slug = require('../../config/slug');
const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
  },
  content: String,
  image: String,
  address: String,
  views: String,
  menu: [
    {
      _id: false,
      name: String,
      price: Number,
      image: String,
    },
  ],
  gallery: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'RestaurantCategory',
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RestaurantSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
