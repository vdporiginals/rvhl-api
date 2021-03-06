const mongoose = require('mongoose');
const AdvertiseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: [true, 'please add a category'],
    },
    description: String,
    keywords: {
      type: String,
      default: 'Danh mục quảng cáo hạ long',
    },
    position: {
      type: String,
      unique: true,
      enum: ['slider', 'video', 'HomepageAdvertise', 'AdvertisePage'],
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

AdvertiseCategorySchema.pre('save', function (next) {
  return next();
});

AdvertiseCategorySchema.pre('remove', async function (next) {
  console.log(`Advertise being removed from AdvertiseCategory ${this._id}`);
  await this.model('Advertise').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model(
  'AdvertiseCategory',
  AdvertiseCategorySchema
);
