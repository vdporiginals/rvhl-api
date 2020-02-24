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
  seo: String,
  status: {
    type: Boolean,
    default: false
  },
  image: {
    type: String
  }
});

BlogSchema.pre('save', function(next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = new mongoose.model('Blog', BlogSchema);
