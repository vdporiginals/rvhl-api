const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const BlogSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add description'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'BlogCategory',
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  keywords: String,
  tags: [String],
  address: String,
  seo: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: `${process.env.HOST_URL}${process.env.PORT}/no-photo.jpg`,
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

BlogSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  next();
});


// BlogSchema.pre('remove', async function (next) {
//   console.log(`comment being removed from blog ${this._id}`);
//   await this.model('Comment').deleteMany({
//     postId: this._id
//   });
//   next();
// });

// Revere populate  
BlogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  justOne: false
});


module.exports = new mongoose.model('Blog', BlogSchema);