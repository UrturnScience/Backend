const Preference = require("../models/preference.model");
const Chore = require("../models/chore.model");
const RoomUser = require("../models/room_user.model");

//Updates the user's preferences to match the ordering given by the user(used for preference.update controller)
exports.updatePreferences = async function(userId, preferenceIds) {
  //Want to ensure that the list of preferences being given is accurate for the user
  //Makes sure that the preferences belong to the user and get the chores corresponding to them
  const choreIds = await Preference.find({
    _id: { $in: preferenceIds },
    userId: userId
  }).distinct("choreId");
  //Makes sure that the chores for the preferences are actually upcoming
  const upcomingChores = await Chore.find({ _id: choreIds, upcoming: true });

  if (upcomingChores.length == preferenceIds.length) {
    for (let i = 0; i < preferenceIds.length; ++i) {
      const preference = await Preference.findOne({ _id: preferenceIds[i] });
      preference.weight = i;
      await preference.save();
    }
  }
};

exports.fixPreferencesByUserId = async function(userId) {
  //Want to fix the user's preferences in the cause of deleted chore, new chore, etc

  //Want to get the the room for the user
  const roomUser = await RoomUser.findOne({ userId: userId });

  //Want to get the upcoming chores for that user's room
  const upcomingChoreIds = await Chore.find({
    roomId: roomUser.roomId,
    upcoming: true
  }).distinct("_id");

  //Want to get the upcoming preferences for that user sorted ascending by their weight values
  const upcomingPreferences = await Preference.find({
    userId: userId,
    choreId: { $in: upcomingChoreIds }
  }).sort({ weight: 1 });

  //Ensures that the preference weights for the user are unique and ascending without gaps from 0
  //Since we have the preferences sorted initially by weight, we can preserve the relative order that was saved from before
  for (let i = 0; i < upcomingPreferences.length; ++i) {
    upcomingPreferences[i].weight = i;
    await upcomingPreferences[i].save();
  }
};

exports.fixPreferencesByRoomId = async function(roomId) {
  const userIds = await RoomUser.find({ roomId: roomId }).distinct("userId");
  for (let i = 0; i < userIds.length; ++i) {
    await this.fixPreferencesByUserId(userIds[i]);
  }
};
