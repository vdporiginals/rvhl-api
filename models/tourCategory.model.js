const mongoose = require('mongoose');

const TourCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'please add a category'],
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

TourCategorySchema.pre('remove', async function (next) {
  console.log(`Tour being removed from tourcategory ${this._id}`);
  await this.model('Tour').deleteMany({ bootcamp: this._id });
  next();
});

module.exports = new mongoose.model('TourCategory', TourCategorySchema);
