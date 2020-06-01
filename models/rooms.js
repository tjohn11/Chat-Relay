const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const roomSchema = new Schema({
  roomname: {
      type: String,
      required: true
  },
  roomid: {
      type: String,
      required: true
  },
  date: {
    type: Date,
    default: moment(),
    required: true
  }
});

module.exports = mongoose.model('rooms', roomSchema);