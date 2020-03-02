const room = require("../models/room.model");

exports.create = function(req, res) {
  const room = new room({
    active: true
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
      res.status(500).send("Error hello");
    } else {
      res.status(200).send(rooms);
    }
  });
};

exports.details = function(req, res) {
  room.findById(req.params.id, (err, room) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(room);
    }
  });
};

exports.update = function(req, res) {
  Room.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, room) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(room);
    }
  });
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
