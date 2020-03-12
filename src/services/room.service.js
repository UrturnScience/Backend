const User = require("../models/user.model");
const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");

exports.getUsersForRoom = async function(roomId) {
  roomUsers = await RoomUser.find({ roomId: roomId });
  userIds = [];
  for (var i = 0; i < roomUsers.length; i++) {
    userIds.push(roomUsers[i].get("userId"));
  }
  return userIds;
};
