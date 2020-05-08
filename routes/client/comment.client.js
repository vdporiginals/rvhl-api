const express = require('express');
const {
    getComments,
    createBlogComment,
    updateComment,
    deleteComment
} = require('../../controllers/comment/comment.controller');

const Comment = require('../../models/comment/comment.model');
const advancedResults = require('../../middleware/advancedResults');
const Reply = require('../../models/comment/reply.model');
const router = express.Router();

const {
    protect,
    authorize
} = require('../../middleware/auth');

router
    .route('/:postId')
    .get(
        advancedResults(
            Comment, [{
                path: 'author',
                select: 'name avatar description',
            }, {
                path: 'postId',
                select: 'name',
            }]
        ),
        getComments
    )
    .post(protect, createBlogComment);

router
    .route('/:postId/:commentId')
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;