const mongoose = require('mongoose');

const AdvertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  seo: String,
  status: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now }
  //   destination: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Bootcamp',
  //     required: true
  //   },
  //   place: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Bootcamp',
  //     required: true
  //   }
});

AdvertiseSchema.pre('save', function(next) {
  this.seo = slug(this.name, '-');
  next();
});

module.exports = mongoose.model('Advertise', AdvertiseSchema);
