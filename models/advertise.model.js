const mongoose = require("mongoose");
const slug = require("../config/slug");
const AdvertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  image: {
    type: String,
    default: "no-photo.jpg"
  },
  seo: String,
  status: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: [
      "bannerBlog",
      "bannerTour",
      "bannerSchedule",
      "bannerFood",
      "video",
      "about",
      "slider",
      "other"
    ]
  },
  createdAt: { type: Date, default: Date.now }
});

AdvertiseSchema.pre("save", function(next) {
  this.seo = slug(this.title, "-");
  next();
});

module.exports = mongoose.model("Advertise", AdvertiseSchema);
