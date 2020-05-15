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
const router = express.Router();

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
        match: {
          status: true,
        },
      },
    ]),
    getComments
  )
  .post(protect, createBlogComment);

router
  .route('/:postId/:commentId')
  .put(protect, updateComment)
  .get(protect, advancedResults(Reply, 'commentId'), getComments)
  .post(protect, createBlogReply)
  .delete(protect, deleteComment);

module.exports = router;