const mongoose = require("mongoose");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");
const Room = require("../../src/models/room.model");

const {clearUsers} = require("./firebase");



exports.dropDatabase = async function(){
  return await mongoose.connection.db.dropDatabase();
}

exports.clearDatabase = function(){
  Assignment.deleteMany({});
  Chore.deleteMany({});
  Preference.deleteMany({});
  RoomUser.deleteMany({});
  Room.deleteMany({});
  clearUsers();
}
