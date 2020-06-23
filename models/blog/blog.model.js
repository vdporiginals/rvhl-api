const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const BlogSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add title'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'BlogCategory',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    keywords: String,
    tags: [String],
    address: String,
    seo: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: `${process.env.HOST_URL}${process.env.PORT}/no-photo.jpg`,
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

BlogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.seo = slug(this.title, '-');
  next();
});

BlogSchema.virtual('replyCount', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
  count: true,
});

BlogSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
  count: true,
});

BlogSchema.pre('remove', async function (next) {
  console.log(`comment being removed from blog ${this._id}`);
  await this.model('Comment').deleteMany({
    postId: this._id,
  });
  next();
});

module.exports = new mongoose.model('Blog', BlogSchema);
