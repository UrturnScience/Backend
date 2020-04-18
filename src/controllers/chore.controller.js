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
  const chore = await Chore.findOne({_id: req.params.id});
  chore.time = req.body.time;
  await chore.save();
  res.sendStatus(200);
};

exports.delete = async function(req, res) {
  await ChoreService.retireOrDeleteChoreAndPreferencesAndAssignments(req.params.id);
  res.sendStatus(200);
};

exports.upcoming_chores = async function(req, res){
  const chores = await Chore.find({roomId: req.params.rid, upcoming: true});
  res.status(200).json({chores});
}

exports.active_chores = async function(req, res){
  const chores = await Chore.find({roomId: req.params.rid, active: true});
  res.status(200).json({chores});
}
