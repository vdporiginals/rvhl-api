const path = require('path');
const ErrorResponse = require('../../middleware/utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Comment = require('../../models/comment/comment.model');
const Reply = require('../../models/comment/reply.model');
const Blog = require('../../models/blog/blog.model')
exports.getComments = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
//@desciption   create comment
//@route        POST  /api/comments/:postId
//@access       public
exports.createBlogComment = asyncHandler(async (req, res, next) => {
    req.body.postId = req.params.postId;
    req.body.author = req.user._id;

    const blog = await Blog.findById(req.params.postId);

    if (!blog) {
        return next(
            new ErrorResponse(`No blog with the id of ${req.params.postId}`),
            404
        );
    }
    console.log(req.user)
    const comment = await Comment.create(req.body);

    res.status(200).json({
        success: true,
        data: comment,
    });
});


//@desciption   create reply
//@route        POST  /api/comments/:postId/:commentId
//@access       Private
exports.createBlogReply = asyncHandler(async (req, res, next) => {
    req.body.postId = req.params.postId;
    req.body.author = req.user._id;
    req.body.commentId = req.params.commentId;
    const blog = await Blog.findById(req.params.postId);
    if (!blog) {
        return next(
            new ErrorResponse(`No blog with the id of ${req.params.id}`),
            404
        );
    }

    const parentComment = await Comment.findById(req.params.commentId);
    console.log(req.body)

    if (!parentComment) {
        return next(
            new ErrorResponse(
                `Comment not found with id ${req.params.commentId}`,
                404
            )
        );
    }

    const reply = await Reply.create(req.body);
    console.log(reply)
    res.status(200).json({
        success: true,
        data: reply._id,
    });
});

//@desciption   update com
//@route        PUT  /api/comments/:postId/:commentId
//@access       Private
exports.updateComment = asyncHandler(async (req, res, next) => {
    const user = await Comment.findById(req.params.commentId);

    if (user.author.toString() !== req.user._id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this comment ${user._id}`,
                401
            )
        );
    }

    if (!user) {
        return next(
            new ErrorResponse(`comment not found with id of ${req.params.id}`, 404)
        );
    }

    const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: comment._id
    });
});


//@desciption   Update reply
//@route        PUT  /api/comments/reply/:replycommenId
//@access       Private
exports.updateReply = asyncHandler(async (req, res, next) => {
    const user = await Reply.findById(req.params.commentId);

    if (user.author.toString() !== req.user._id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this comment ${user._id}`,
                401
            )
        );
    }

    if (!user) {
        return next(
            new ErrorResponse(`comment not found with id of ${req.params.id}`, 404)
        );
    }

    const reply = await Reply.findByIdAndUpdate(req.params.commentId, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: reply._id
    });
});

//@desciption   delete rep
//@route        delete  /api/comments/:postId/:commentId
//@access       Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        return next(
            new ErrorResponse(`No comment with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is course owner
    if (comment.author.toString() !== req.user._id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user._id} is not authorized to delete course ${comment._id}`,
                401
            )
        );
    }

    await comment.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// Route api/comments/reply/:replyId
// Delete
exports.deleteReply = asyncHandler(async (req, res, next) => {
    const reply = await Reply.findById(req.params.replyId);

    if (!reply) {
        return next(
            new ErrorResponse(`No comment with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is course owner
    if (reply.author.toString() !== req.user._id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user._id} is not authorized to delete course ${comment._id}`,
                401
            )
        );
    }

    await reply.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});