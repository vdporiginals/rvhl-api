const mongoose = require('mongoose');

const UserReviewCategorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);
UserReviewCategorySchema.pre('remove', async function (next) {
  console.log(`Blog being removed from BlogCategory ${this._id}`);
  await this.model('UserReview').deleteMany({
    category: this._id,
  });
  next();
});

module.exports = new mongoose.model(
  'UserReviewCategory',
  UserReviewCategorySchema
);
