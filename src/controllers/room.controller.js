const Room = require("../models/room.model");
const User = require("../models/user.model");

exports.create = function(req, res) {
  const room = new Room({
    active: req.body.active
  });

  room.save(function(err) {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send("Room created successfully: " + room.id);
    }
  });
};

exports.show_all = function(req, res) {
  Room.find({}, (err, rooms) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(rooms);
    }
  });
};

exports.details = function(req, res) {
  Room.findById(req.params.id, (err, room) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(room);
    }
  });
};

exports.update = function(req, res) {
  Room.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, room) => {
      if (err) {
        res.status(500).send("Error");
      } else {
        res.status(200).send(room);
      }
    }
  );
};

exports.delete = function(req, res) {
  Room.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send("room Deleted with ID:" + req.params.id);
    }
  });
};

exports.add_user = async function(req, res) {
  const room = await Room.findById(req.params.rid);
  const user = await User.findById(req.params.uid);

  await room.addUser(user._id);
  await user.addRoom(room._id);
  res.status(200).send("Complete");
}

exports.remove_user = async function(req, res){
  const [room, user] = await Promise.all([Room.findById(req.params.rid), User.findById(req.params.uid)]);
  console.log(1);
  await room.removeUser(user._id);
  await user.removeRoom(room._id);
  console.log(2);
  res.status(200).send("Removed user from room");
}
