const User = require("../models/user.model");

exports.create = async function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  await user.save();
  res.status(200).send("User created successfully: " + user.id);
};

exports.show_all = async function(req, res) {
  const users = await User.find({});
  res.status(200).send(users);
};

exports.details = async function(req, res) {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
};

exports.update = async function(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
  res.status(200).send(user);
};

exports.delete = async function(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("User Deleted with ID:" + req.params.id);
};
