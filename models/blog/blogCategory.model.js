const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: [true, 'please add a name'],
  },
  description: String,
  keywords: {
    type: String,
    default: 'Danh mục review hạ long',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    // default: Date.now,
  },
});
BlogCategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

BlogCategorySchema.pre('remove', async function (next) {
  console.log(`Blog being removed from BlogCategory ${this._id}`);
  await this.model('Blog').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model('BlogCategory', BlogCategorySchema);
