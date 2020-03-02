const User = require("../models/user.model");

exports.create = function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send("User created successfully: " + user.id);
    }
  });
};

exports.show_all = function(req, res) {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).send("Error hello");
    } else {
      res.status(200).send(users);
    }
  });
};

exports.details = function(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(user);
    }
  });
};

exports.update = function(req, res) {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, user) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send(user);
    }
  });
};

exports.delete = function(req, res) {
  User.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).send("User Deleted with ID:" + req.params.id);
    }
  });
};
