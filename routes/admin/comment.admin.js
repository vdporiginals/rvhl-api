const express = require("express");
const {
  getComments,
  createBlogComment,
  updateComment,
  createBlogReply,
  deleteReply,
  updateReply,
  deleteComment,
} = require("../../controllers/comment/comment.controller");

const Comment = require("../../models/comment/comment.model");
const advancedResults = require("../../middleware/advancedResults");
const Reply = require("../../models/comment/reply.model");
const router = express.Router();

const { protect, authorize } = require("../../middleware/auth");

router.route("/comments/:postId").get(
  advancedResults(Comment, [
    {
      path: "author",
    },
    {
      path: "postId",
      select: "title",
    },
    {
      path: "answer",
    },
    { path: "answerCount" },
  ]),
  getComments
);

module.exports = router;
