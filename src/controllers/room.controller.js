const Room = require("../models/room.model");

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
