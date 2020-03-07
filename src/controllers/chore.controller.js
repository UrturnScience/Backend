const Chore = require("../models/chore.model");

exports.create = async function(req, res) {
  const chore = new Chore({
    roomId: req.body.roomId,
    name: req.body.name,
    time: req.body.time,
    recurring: req.body.recurring
  });

  await chore.save();
  res.status(200).json({ _id: chore.id });
};

exports.show_all = async function(req, res) {
  const chores = await Chore.find({});
  res.status(200).json({ chores });
};

exports.details = async function(req, res) {
  const chore = await Chore.findById(req.params.id);
  res.status(200).json({ chore });
};

exports.show_room = async function(req, res) {
  const chores = await Chore.find({ roomId: req.params.rid });
  res.status(200).json({ chores });
};

exports.update = async function(req, res) {
  const chore = await Chore.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({ chore });
};

exports.delete = async function(req, res) {
  await Chore.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
};
