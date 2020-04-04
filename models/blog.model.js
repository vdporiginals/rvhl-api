const mongoose = require('mongoose');
const slug = require('../config/slug');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add description'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
    enum: ['Schedule', 'Food', 'Other'],
  },
  // comment: {},
  // tags: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Tags'
  // },
  address: String,
  seo: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: 'no-photo.jpg',
  },
});

BlogSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = new mongoose.model('Blog', BlogSchema);
