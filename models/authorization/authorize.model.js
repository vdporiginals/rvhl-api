const mongoose = require('mongoose');
const shortid = require('shortid');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const AuthorizeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  permission: {
    type: String,
    enum: ['read', 'write', 'delete'],
    required: true,
    default: 'read',
  },
  routeAccept: {
    type: [String],
    validate: {
      validator: function (id) {
        console.log(id);
        if (id[0] === 'default') {
          return true;
        }
      },
      message: (props) => `${props.value} Không phải là route id!`,
    },
    default: 'default',
  },
});

module.exports = mongoose.model('Authorize', AuthorizeSchema);
