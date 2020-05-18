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
