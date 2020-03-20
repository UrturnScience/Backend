const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({});

module.exports = mongoose.model("Room", RoomSchema);
