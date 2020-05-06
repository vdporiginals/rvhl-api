const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'please add a category'],
  },
  description: String,
  keywords: {
    type: String,
    default: 'Danh mục review hạ long',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

BlogCategorySchema.pre('remove', async function (next) {
  console.log(`Blog being removed from BlogCategory ${this._id}`);
  await this.model('Blog').deleteMany({
    category: this._id
  });
  next();
});

module.exports = new mongoose.model('BlogCategory', BlogCategorySchema);