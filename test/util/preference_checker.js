const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");
const Room = require("../../src/models/room.model");
const User = require("../../src/models/user.model");

exports.validateUserPreferencesByUserId = async function(userId) {
  //Used to make sure that the user's preferences for the upcoming chores are proper
  //Preferences are not allowed to have duplicate values, must be 0-># of chores

  const roomUser = await RoomUser.findOne({ userId: userId });
  const roomId = roomUser.roomId;

  const upcomingChoreIds = await Chore.find({
    roomId: roomId,
    upcoming: true
  }).distinct("_id");

  //Get the relevant preferences
  const preferences = await Preference.find({
    userId: userId,
    choreId: { $in: upcomingChoreIds }
  }).sort({"weight": 1});

  //If preferences are not in the proper format: return false, else return true
  for (let i = 0; i < preferences.length; ++i) {
    if (preferences[i].weight != i) {
      return false;
    }
  }
  return true;
};

exports.validateUserPreferencesByRoomId = async function(roomId){
  const userIds = await RoomUser.find({roomId: roomId}).distinct("userId");
  for(let i = 0; i < userIds.length; ++i){
    const result = await this.validateUserPreferencesByUserId(userIds[i]);
    if(result == false){
      return false;
    }
  }
  return true;
}

exports.getNumberOfUpcomingChores = async function(roomId){
      //Used to make sure that the user's preferences for the upcoming chores are proper
  //Preferences are not allowed to have duplicate values, must be 0-># of chores

  const upcomingChoreIds = await Chore.find({
    roomId: roomId,
    upcoming: true
  });

  return upcomingChoreIds.length;
}
