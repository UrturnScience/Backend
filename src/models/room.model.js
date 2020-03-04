const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
  active: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model("Room", RoomSchema);
