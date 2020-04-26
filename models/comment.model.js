const mongoose = require('mongoose');

const CommentSchema = new Schema({
  id: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  comment: String,
  reply: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],
    default: [],
  },
});

module.exports = new mongoose.model('CommentSchema', CommentSchema);
