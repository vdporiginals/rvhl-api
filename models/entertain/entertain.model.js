const mongoose = require('mongoose');
const slug = require('../../config/slug');
const EntertainSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
  },
  content: String,
  address: String,
  images: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'EntertainCategory',
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

EntertainSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Entertain', EntertainSchema);
