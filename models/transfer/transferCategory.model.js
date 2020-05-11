const mongoose = require('mongoose');

const TransferCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: [true, 'please add a category'],
    },
    keywords: {
      type: String,
      default: 'Danh mục di chuyển hạ long',
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now,
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

TransferCategorySchema.virtual('transfers', {
  ref: 'Transfer',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});

TransferCategorySchema.pre('remove', async function (next) {
  console.log(`Transfer being removed from category ${this._id}`);
  await this.model('Transfer').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model('TransferCategory', TransferCategorySchema);
