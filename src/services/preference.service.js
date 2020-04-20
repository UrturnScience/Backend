const Preference = require("../models/preference.model");
const Chore = require("../models/chore.model");
const RoomUser = require("../models/room_user.model");

//Updates the user's preferences to match the ordering given by the user(used for preference.update controller)
exports.updatePreferences = async function (userId, preferenceIds) {
  for (let i = 0; i < preferenceIds.length; ++i) {
    const preference = await Preference.findOne({ _id: preferenceIds[i] });
    preference.weight = i;
    await preference.save();
  }

  await this.fixPreferencesByUserId(userId);
};

exports.getUpcomingPreferences = async function (userId) {
  //get the roomId the user is in
  const roomUser = await RoomUser.findOne({ userId: userId });
  const roomId = roomUser.roomId;

  //get upcoming chores for that room
  const upcomingChoreIds = await Chore.find({
    roomId: roomId,
    upcoming: true,
  }).distinct("_id");

  //get the users preferences
  const preferences = await Preference.find({
    userId: userId,
    choreId: { $in: upcomingChoreIds },
  }).sort({ weight: 1 });

  return preferences;
};

exports.fixPreferencesByUserId = async function (userId) {
  //Want to fix the user's preferences in the cause of deleted chore, new chore, etc

  const upcomingPreferences = await this.getUpcomingPreferences(userId);

  //Ensures that the preference weights for the user are unique and ascending without gaps from 0
  //Since we have the preferences sorted initially by weight, we can preserve the relative order that was saved from before
  for (let i = 0; i < upcomingPreferences.length; ++i) {
    upcomingPreferences[i].weight = i;
    await upcomingPreferences[i].save();
  }
};

exports.fixPreferencesByRoomId = async function (roomId) {
  const userIds = await RoomUser.find({ roomId: roomId }).distinct("userId");
  for (let i = 0; i < userIds.length; ++i) {
    await this.fixPreferencesByUserId(userIds[i]);
  }
};
