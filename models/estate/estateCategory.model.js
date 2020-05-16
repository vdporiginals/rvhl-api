const mongoose = require('mongoose');

const EstateCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: [true, 'please add a category'],
    },
    description: String,
    keywords: {
      type: String,
      default: 'Danh mục chỗ ở',
    },
    position: {
      type: String,
      enum: ['Hotel', 'Villa', 'Homestay'],
      required: [true, 'Please add a position'],
    },
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

EstateCategorySchema.virtual('hotels', {
  ref: 'Hotel',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});

EstateCategorySchema.virtual('homestays', {
  ref: 'Homestay',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});

EstateCategorySchema.virtual('villas', {
  ref: 'Villa',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});

EstateCategorySchema.pre('remove', async function (next) {
  console.log(`Estate being removed from EstateCategory ${this._id}`);
  await this.model('Hotel').deleteMany({
    category: this._id,
  });
  next();
});

EstateCategorySchema.pre('remove', async function (next) {
  console.log(`Villa being removed from EstateCategory ${this._id}`);
  await this.model('Villa').deleteMany({
    category: this._id,
  });
  next();
});

EstateCategorySchema.pre('remove', async function (next) {
  console.log(`Homestay being removed from EstateCategory ${this._id}`);
  await this.model('Homestay').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model('EstateCategory', EstateCategorySchema);
