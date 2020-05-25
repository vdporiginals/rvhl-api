const express = require('express');
const {
  getComments,
  createBlogComment,
  updateComment,
  createBlogReply,
  deleteReply,
  updateReply,
  deleteComment,
} = require('../../controllers/comment/comment.controller');

const Comment = require('../../models/comment/comment.model');
const advancedResults = require('../../middleware/advancedResults');
const Reply = require('../../models/comment/reply.model');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 second
  max: 5,
});

const { protect, authorize } = require('../../middleware/auth');

router
  .route('/reply/:replyId')
  .put(protect, updateReply)
  .delete(protect, deleteReply);

router
  .route('/:postId')
  .get(
    advancedResults(Comment, [
      {
        path: 'author',
      },
      {
        path: 'postId',
        select: 'title',
      },
      {
        path: 'answer',
        status: true,
      },
      { path: 'answerCount' },
    ]),
    getComments
  )
  .post(protect, apiLimiter, createBlogComment);

router
  .route('/:postId/:commentId')
  .put(protect, updateComment)
  .get(protect, advancedResults(Reply, 'commentId'), getComments)
  .post(protect, apiLimiter, createBlogReply)
  .delete(protect, deleteComment);

module.exports = router;
