const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Xin hay them tieu de cho tin']
  },
  content: {
    type: String
  },
  images: {
    type: mongoose.Schema.ObjectId,
    ref: 'Image'
  }
});

module.exports = new mongoose.model('Blog', BlogSchema);
