const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema(
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
    commentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const autoPopulateLead = function (next) {
  this.populate('author');
  next();
};

ReplySchema.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

module.exports = new mongoose.model('Reply', ReplySchema);
