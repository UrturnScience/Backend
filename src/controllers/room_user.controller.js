const RoomUser = require("../models/room_user.model");

const RoomUserService = require("../services/room_user.service");

exports.show_all = async function(req, res) {
  const roomUsers = await RoomUser.find({});
  res.status(200).json({ roomUsers });
};

exports.add_user = async function(req, res) {
  const result = await RoomUserService.addUserToRoomAndPopulatePreferences(
    req.params
  );
  res.status(200).json({ result });
};

exports.remove_user = async function(req, res) {
  await RoomUserService.removeUserFromRoomAndDeletePreferencesAndAssignments(
    req.params.uid
  );
  res.sendStatus(200);
};

exports.show_room = async function(req, res) {
  const roomUsers = await RoomUser.find({ roomId: req.params.rid });
  res.status(200).json({ roomUsers });
};

exports.show_user = async function(req, res) {
  const roomUsers = await RoomUser.find({ userId: req.params.uid });
  res.status(200).json({ roomUsers });
};
