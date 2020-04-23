const mongoose = require('mongoose');
const slug = require('../config/slug');
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const BlogSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  postId: { type: Number, default: 0 },
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
    default: `localhost:${process.env.PORT}/no-photo.jpg`,
  },
});

BlogSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  this.postId = next();
});

module.exports = new mongoose.model('Blog', BlogSchema);
