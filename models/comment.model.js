const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  status: Boolean,
  reply: [this], // <-- Reference to CommentSchema ???
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: false },
  authorAvatar: String,
  postId: { type: String, ref: 'Blog', required: true },
});

// Use a regular function here to avoid issues with this!
CommentSchema.pre('save', function (next) {
  const date = new Date();
  this.updatedAt = date;
  if (!this.createdAt) {
    this.createdAt = date;
  }
  next();
});

module.exports = new mongoose.model('CommentSchema', CommentSchema);
