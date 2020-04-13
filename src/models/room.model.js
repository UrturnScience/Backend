const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({});

RoomSchema.statics.getRoomIdByUserId = async function(userId) {
  const roomUser = await this.findOne({ userId: userId });
  return roomUser.roomId;
};

RoomSchema.statics.getUserIdsByRoomId = async function(roomId) {
  const roomUsers = await this.find({ roomId: roomId });

  const userIds = [];
  for (var i = 0; i < roomUsers.length; i++) {
    userIds.push(roomUsers[i].get("userId"));
  }

  return userIds;
};

module.exports = mongoose.model("Room", RoomSchema);
