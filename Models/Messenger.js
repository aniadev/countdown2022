const mongoose = require("mongoose");

const MessengerSchema = new mongoose.Schema({
  msg: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    default: "",
  },
  name: {
    type: String,
    required: true,
    default: "Người nào đó",
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("messages", MessengerSchema);
