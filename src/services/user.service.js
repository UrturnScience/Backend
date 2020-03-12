const User = require("../models/user.model");
const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");

const RoomUserService = require("./room_user.service");
const ChoreService = require("./chore.service");

exports.deleteUserAndReferences = async function(userId) {
  await RoomUserService.removeUserFromRoomAndDeleteReferences(userId);
  await User.deleteOne({_id: userId});
};
