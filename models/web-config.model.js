const mongoose = require('mongoose');
const WebconfigSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'webconfig1',
  },
  fbShare: String,
  fbLike: String,
  fbPage: String,
  fbGroup: String,
  contact: String,
});

module.exports = mongoose.model('Webconfig', WebconfigSchema);
