const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  status: Boolean,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const autoPopulateLead = function (next) {
  this.populate("author");
  next();
};

ReplySchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

// Use a regular function here to avoid issues with this!
ReplySchema.pre("save", function (next) {
  const date = new Date();
  this.updatedAt = date;
  if (!this.createdAt) {
    this.createdAt = date;
  }
  next();
});

module.exports = new mongoose.model("Reply", ReplySchema);
