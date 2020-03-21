const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");

const RoomUserService = require("./room_user.service");

exports.deleteRoomAndReferences = async function(roomId) {
  //Deletes roomusers(preferences and assignments) and chores relating to that room, and deletes room

  //Remove users from that room(also deletes preferences and assignments for that user)
  const userIds = await RoomUser.find({roomId:roomId}).distinct("userId");
  for(let i = 0; i < userIds.length; ++i){
    await RoomUserService.removeUserFromRoomAndDeletePreferencesAndAssignments(userIds[i]);
  }

  //Delete chores belonging to that room
  await Chore.deleteMany({roomId: roomId}); //Don't need to worry about preferences and assignments, since above did it

  //Delete room
  await Room.deleteOne({ _id: roomId });
};
