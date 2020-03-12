const Room = require("../models/room.model");
const User = require("../models/user.model");

const RoomService = require("../services/room.service");

exports.create = async function(req, res) {
  const room = new Room({
    active: req.body.active
  });

  await room.save();
  res.status(200).json({ _id: room.id });
};

exports.show_all = async function(req, res) {
  const rooms = await Room.find({});
  res.status(200).json({ rooms });
};

exports.details = async function(req, res) {
  const room = await Room.findOne({ _id: req.params.id });
  res.status(200).json({ room });
};

exports.update = async function(req, res) {
  const room = await Room.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({ room });
};

exports.delete = async function(req, res) {
  await RoomService.deleteRoomAndReferences(req.params.id);
  res.sendStatus(200);
};
