const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const TourSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add Title'],
    },
    keywords: String,
    schedule: [
      {
        _id: false,
        timeStart: Date,
        timeEnd: Date,
        location: String,
        service: String,
      },
    ],
    content: String,
    isPopular: {
      type: Boolean,
      default: false,
    },
    video: String,
    description: String,
    phone: String,
    customerNum: Number,
    time: String,
    price: {
      type: Number,
      required: [true, 'Please add price'],
      validate: {
        validator: function (v) {
          return /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}?$/g.test(
            v
          );
        },
        message: (props) => `${props.value} Không phải là 1 số điện thoại!`,
      },
    },
    seo: String,
    image: String,
    status: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      enum: ['TourCruise', 'TourAll', 'TourHaLong'],
      required: [true, 'Please add a position'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'TourCategory',
    },
    address: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    images: {
      type: [String],
      default: 'no-photo.jpg',
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

TourSchema.pre('save', function (next) {
  this.seo = slug(this.title, '-');
  this.schedule.sort(function (a, b) {
    return new Date(a.timeStart) - new Date(b.timeStart);
  });
  next();
});

module.exports = new mongoose.model('Tour', TourSchema);
