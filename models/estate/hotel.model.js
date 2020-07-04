const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const HotelSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
    },
    content: String,
    roomNum: Number,
    isPopular: {
      type: Boolean,
      default: false,
    },
    address: String,
    views: String,
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'EstateCategory',
    },
    facilities: {
      bed: String,
      square: Number,
      pool: Boolean,
      oceanViews: Boolean,
      restaurant: Boolean,
      meetingRoom: Boolean,
      other: [String],
    },
    image: String,
    showHomepage: Boolean,
    phone: {
      type: String,
      required: [true, 'Please add a phone'],
      validate: {
        validator: function (v) {
          return /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}?$/g.test(
            v
          );
        },
        message: (props) => `${props.value} Không phải là 1 số điện thoại!`,
      },
    },
    keywords: String,
    seo: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

HotelSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);
