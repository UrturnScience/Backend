const Room = require("../models/room.model");
const User = require("../models/user.model");
const RoomUser = require("../models/room_user.model");

exports.show_all = async function(req, res){
    const roomUsers = await RoomUser.find({});
    res.status(200).json({roomUsers});
}

exports.add_user = async function(req, res) {
  const roomUser = new RoomUser({
    roomId: req.params.rid,
    userId: req.params.uid
  });

  await roomUser.save();
  res.status(200).json({ roomUser });
};

exports.remove_user = async function(req, res) {
  await RoomUser.findOneAndDelete({roomId: req.params.rid, userId: req.params.uid});
  res.sendStatus(200);
};

exports.show_room = async function(req, res){
  const roomUsers = await RoomUser.findByRoomId(req.params.rid);
  res.status(200).json({roomUsers});
}
