const User = require("../models/user.model");

const UserService = require("../services/user.service");

exports.create = async function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  await user.save();
  res.status(200).json({ _id: user.id });
};

exports.show_all = async function(req, res) {
  const users = await User.find({});
  res.status(200).json({ users });
};

exports.details = async function(req, res) {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user });
};

exports.update = async function(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
  res.status(200).json({ user });
};

exports.delete = async function(req, res) {
  await UserService.deleteUserAndReferences(req.params.id);
  res.sendStatus(200);
};
