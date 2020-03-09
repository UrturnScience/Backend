const Assignment = require("../models/assignment.model");

exports.create = async function(req, res) {
  const assignment = new Assignment({
    userId: req.body.userId,
    choreId: req.body.choreId
  });

  await assignment.save();
  res.status(200).json({ assignment });
};

exports.show_all = async function(req, res) {
  const assignments = await Assignment.find({});
  res.status(200).json({ assignments });
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
