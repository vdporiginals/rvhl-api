const mongoose = require('mongoose');

const CheckRoomSchema = new mongoose.Schema({
  checkInDay: Date,
  checkOutDay: Date,
  night: Number,
  peopleNum: Number,
  roomCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'EstateCategory',
  },
  checkHandle: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
    match: [
      /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g,
      'Hãy nhập đúng số điện thoại của bạn',
    ],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onEsate',
  },
  onEstate: {
    type: String,
    required: true,
    enum: ['Hotel', 'Villa', 'Homestay'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model('CheckRoom', CheckRoomSchema);
