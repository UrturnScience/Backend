const Chore = require("../models/chore.model");

const ChoreService = require("../services/chore.service");

exports.create = async function(req, res) {
  const result = await ChoreService.createChoreAndPreferences(req.body);
  res.status(200).json({ result });
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
  await ChoreService.retireOrDeleteChoreAndPreferencesAndAssignments(req.params.id);
  res.sendStatus(200);
};
