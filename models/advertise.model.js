const mongoose = require('mongoose');

const AdvertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Xin hay them tieu de']
  },
  description: {
    type: String,
    required: [true, 'Xin hay them mo ta']
  },
  images: {
    type: mongoose.Schema.ObjectId,
    ref: 'Image'
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

module.exports = mongoose.model('Advertise', AdvertiseSchema);
