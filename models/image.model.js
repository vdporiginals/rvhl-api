const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for Image']
  },
  seo: String,
  imageUrl: {
    type: String,
    required: [true, 'please add a url for Image']
  }
});

ImageSchema.pre('save', function(next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Image', ImageSchema);
