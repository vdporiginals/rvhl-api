const mongoose = require('mongoose');
const slug = require('../../config/slug');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const RestaurantSchema = new mongoose.Schema(
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
    },
    content: String,
    image: String,
    address: String,
    views: String,
    price: Number,
    menu: [
      {
        _id: false,
        name: String,
        price: Number,
        description: String,
        image: String,
      },
    ],
    gallery: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'RestaurantCategory',
    },
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
    isPopular: {
      type: Boolean,
      default: false,
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

RestaurantSchema.pre('save', function (next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
