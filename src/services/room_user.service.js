const Preference = require("../models/preference.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");
Assignment = require("../models/assignment.model");

const PreferenceService = require("./preference.service");

exports.addUserToRoomAndPopulatePreferences = async function(body) {
  //Add user to the room, and create preferences for that user for all existing chores in that room
  const objects = {};

  //add user to room
  const roomUser = new RoomUser({
    roomId: body.rid,
    userId: body.uid
  });
  await roomUser.save();
  objects["roomUser"] = roomUser;

  //Get chores in the room for that user
  const choreIds = await Chore.getChoreIdsByRoomId(roomUser.roomId);

  //create preferences for chores in the room
  for (var i = 0; i < choreIds.length; ++i) {

    const preference = new Preference({
      choreId: choreIds[i],
      userId: roomUser.userId
    });
    await preference.save();
  }

  await PreferenceService.fixPreferencesByUserId(roomUser.userId);
  objects['preferences'] = await Preference.find({userId: roomUser.userId});

  return objects;
};

exports.removeUserFromRoomAndDeletePreferencesAndAssignments = async function(userId) {
  //Remove user from room, delete chore preferences and assignments

  //Since user can only be assigned to one room at a time, we can do it this way
  await Preference.deleteMany({userId: userId});
  await Assignment.deleteMany({userId: userId});

  //Remove the user from the room
  await RoomUser.deleteOne({ userId: userId });
};
