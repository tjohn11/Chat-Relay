const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const roomSchema = new Schema({
  roomname: {
      type: String,
      required: true
  },
  datecreated: {
    type: Date,
    default: moment(),
  }
});

module.exports = mongoose.model('rooms', roomSchema);