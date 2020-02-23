const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Xin hay them ten anh']
  },
  seo: String,
  imageUrl: {
    type: String,
    required: [true, 'Xin hay them duong dan anh']
  }
});

ImageSchema.pre('save', function(next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Image', ImageSchema);
