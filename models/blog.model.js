const mongoose = require('mongoose');
const slug = require('../config/slug');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add description']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  seo: String,
  status: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  }
});

BlogSchema.pre('save', function(next) {
  this.seo = slug(this.title, '-');
  next();
});

module.exports = new mongoose.model('Blog', BlogSchema);
