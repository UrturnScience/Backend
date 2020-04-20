const mongoose = require("mongoose");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");
const Room = require("../../src/models/room.model");
const User = require("../../src/models/user.model");
const Message = require("../../src/models/message.model");
const { clearUsers } = require("./firebase");

exports.dropDatabase = async function () {
  return await mongoose.connection.db.dropDatabase();
};

exports.clearDatabase = async function () {
  await Assignment.deleteMany({});
  await Chore.deleteMany({});
  await Preference.deleteMany({});
  await RoomUser.deleteMany({});
  await Room.deleteMany({});
  await User.deleteMany({});
  await Message.deleteMany({});
  await clearUsers();
};
