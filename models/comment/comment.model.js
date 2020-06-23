const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    status: Boolean,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: String,
      ref: 'Blog',
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

CommentSchema.virtual('answer', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'commentId',
  justOne: false,
});

CommentSchema.virtual('answerCount', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'commentId',
  justOne: false,
  count: true,
});

// Use a regular function here to avoid issues with this!
CommentSchema.pre('remove', async function (next) {
  console.log(`reply being removed from comment ${this._id}`);
  await this.model('Reply').deleteMany({
    commentId: this._id,
  });
  next();
});

module.exports = new mongoose.model('Comment', CommentSchema);
