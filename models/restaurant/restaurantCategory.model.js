const mongoose = require('mongoose');

const RestaurantCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: [true, 'please add a category'],
    },
    description: String,
    keywords: {
      type: String,
      default: 'Danh mục nhà hàng',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      // default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
RestaurantCategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

RestaurantCategorySchema.pre('remove', async function (next) {
  console.log(`Restaurant being removed from RestaurantCategory ${this._id}`);
  await this.model('Hotel').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model(
  'RestaurantCategory',
  RestaurantCategorySchema
);
