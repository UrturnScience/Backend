const User = require("../models/user.model");

const RoomUserService = require("./room_user.service");

exports.deleteUserAndReferences = async function(userId) {
  //Remove user from existing room
  await RoomUserService.removeUserFromRoomAndDeletePreferencesAndAssignments(userId);
  //Delete user
  await User.deleteOne({ _id: userId });
};
