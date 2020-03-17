const User = require("../models/user.model");
const admin = require("firebase-admin");

exports.create = async function(req, res) {
  const user = new User(req.body);

  await user.save();
  res.status(200).json({ _id: user.id });
};

exports.login = async function(req, res) {
  const decodedToken = await admin
    .auth()
    .verifyIdToken(req.headers.authorization);
  const user = await User.findOne({ firebaseId: decodedToken.uid });

  req.session.userId = user._id;
  res.status(200).json({ user });
};

exports.logout = async function(req, res) {
  req.session.destroy(function() {
    res.sendStatus(200);
  });
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
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
};
