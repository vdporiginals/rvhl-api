const mongoose = require('mongoose');

const TourCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: [true, 'please add a category'],
  },
  keywords: {
    type: String,
    default: 'Danh mục tour hạ long',
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TourCategorySchema.pre('remove', async function (next) {
  console.log(`Tour being removed from tourcategory ${this._id}`);
  await this.model('Tour').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model('TourCategory', TourCategorySchema);
