const mongoose = require('mongoose');

const EntertainCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: [true, 'please add a name'],
  },
  description: String,
  keywords: {
    type: String,
    default: 'Danh mục giải trí hạ long',
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
EntertainCategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

EntertainCategorySchema.pre('remove', async function (next) {
  console.log(`Entertain being removed from EntertainCategory ${this._id}`);
  await this.model('Entertain').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model(
  'EntertainCategory',
  EntertainCategorySchema
);
