const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");
const Room = require("../../src/models/room.model");
const { setupCurrentUser } = require("./firebase");

exports.create_assignment = async function (choreId, userId) {
  const assignment = new Assignment({
    userId: userId,
    choreId: choreId,
    active: true,
    successful: false,
  });

  await assignment.save();

  return assignment;
};

exports.create_chore = async function (
  roomId,
  name,
  time,
  recurring = false,
  upcoming = true,
  active = false
) {
  const chore = new Chore({
    roomId: roomId,
    name: name,
    time: time,
    recurring: recurring,
    upcoming: upcoming,
    active: active,
  });

  await chore.save();

  return chore;
};

exports.create_preference = async function (choreId, userId, weight) {
  const preference = new Preference({
    choreId: choreId,
    userId: userId,
    weight: weight,
  });

  await preference.save();

  return preference;
};

exports.create_room_user = async function (roomId, userId) {
  const room_user = new RoomUser({
    roomId: roomId,
    userId: userId,
  });

  await room_user.save();

  return room_user;
};

exports.create_room = async function (active = true) {
  const room = new Room({
    active: active,
  });

  await room.save();

  return room;
};

exports.create_user = async function (username) {
  return setupCurrentUser(username + "@google.com", "password");
};
