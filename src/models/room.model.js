const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({});

RoomSchema.statics.getRoomIdByUserId = async function(userId) {
  const roomUser = await this.findOne({ userId: userId });
  return roomUser.roomId;
};

module.exports = mongoose.model("Room", RoomSchema);
