const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomname: {
      type: String,
      required: true
  },
  roomid: {
      type: String,
      required: true
  }
});

module.exports = mongoose.model("rooms", roomSchema);