const mongoose = require('mongoose');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const RouteSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  path: {
    type: String,
    default: '/',
    unique: [true, 'Only have one route path !!'],
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Route', RouteSchema);
