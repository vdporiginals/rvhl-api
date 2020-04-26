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

module.exports = new mongoose.model('TourCategory', TourCategorySchema);
