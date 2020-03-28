const express = require("express");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../../controllers/blog.controller");

const Blog = require("../../models/blog.model");
const advancedResults = require("../../middleware/advancedResults");

const router = express.Router();

const { protect, authorize } = require("../../middleware/auth");
// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), blogPhotoUpload);

router
  .route("/")
  .get(advancedResults(Blog, null), getBlogs)
  .post(protect, authorize("moderator", "admin"), createBlog);

router
  .route("/:id")
  .get(getBlog)
  .put(protect, authorize("moderator", "admin"), updateBlog)
  .delete(protect, authorize("moderator", "admin"), deleteBlog);

module.exports = router;
