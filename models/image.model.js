const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Xin hay them ten anh']
  },
  imageUrl: {
    type: String,
    required: [true, 'Xin hay them duong dan anh']
  }
});

module.exports = mongoose.model('Image', ImageSchema);
