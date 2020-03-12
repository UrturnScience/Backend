const User = require("../models/user.model");
const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");

const RoomUserService = require("./room_user.service");
const ChoreService = require("./chore.service");

exports.getUsersForRoom = async function(roomId) {
  roomUsers = await RoomUser.find({ roomId: roomId });
  userIds = [];
  for (var i = 0; i < roomUsers.length; i++) {
    userIds.push(roomUsers[i].get("userId"));
  }
  return userIds;
};

exports.deleteRoomAndReferences = async function(roomId){
  //Delete room, roomusers for that room, and chores for that room

  //Delete roomusers attached to the room
  await RoomUserService.deleteRoomUsersByRoomId(roomId);

  //Delete chores belonging to that room
  const choreIds = await ChoreService.getChoreIdsByRoomId(roomId);
  for (var i = 0; i < choreIds.length; i++) {
    await ChoreService.deleteChoreAndReferences(choreIds[i]);
  }

  //Delete room
  await Room.deleteOne({ _id: roomId });
}
