const Preference = require("../models/preference.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");
Assignment = require("../models/assignment.model");

const ChoreService = require("./chore.service");

exports.createRoomUserAndPreferences = async function(body) {
  let objects = {};

  //Create chore
  const roomUser = new RoomUser({
    roomId: body.rid,
    userId: body.uid
  });

  await roomUser.save();
  objects["roomUser"] = roomUser;

  //Get chores in the room for that user
  choreIds = await ChoreService.getChoreIdsByRoomId(roomUser.roomId);

  objects["preferences"] = [];
  //create preferences for chore
  for (var i = 0; i < choreIds.length; ++i) {
    const preference = new Preference({
      choreId: choreIds[i],
      userId: roomUser.userId
    });
    await preference.save();
    objects["preferences"].push(preference);
  }

  return objects;
};

exports.getRoomIdByUserId = async function(userId) {
  const roomUser = await RoomUser.findOne({ userId: userId });
  return roomUser.get("roomId");
};

exports.deleteRoomUsersByRoomId = async function(roomId) {
  await RoomUser.deleteMany({ roomId: roomId });
};

exports.removeUserFromRoomAndDeleteReferences = async function(userId) {
  //Remove user from room, delete chore preferences and assignments

  //Room for user
  const roomId = await this.getRoomIdByUserId(userId);
  //Get chores for that room
  const choreIds = await ChoreService.getChoreIdsByRoomId(roomId);

  //Delete the chore preferences and assignments for the user
  for (var i = 0; i < choreIds.length; ++i) {
    await Preference.deleteOne({ userId: userId, choreId: choreIds[i] });
    await Assignment.deleteOne({ userId: userId, choreId: choreIds[i] });
  }

  //Remove the user from the room
  await RoomUser.deleteOne({ userId: userId });
};
