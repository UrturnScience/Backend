const Assignment = require("../models/assignment.model");

const AssignmentService = require("../services/assignment.service");

exports.assignment_cycle = async function (req, res) {
  await AssignmentService.processAssignmentCycle();
  res.sendStatus(200);
};

exports.create_assignments = async function (req, res) {
  await AssignmentService.createAssignments();
  res.sendStatus(200);
};

exports.retire_assignments = async function (req, res) {
  await AssignmentService.retireAssignments();
  res.sendStatus(200);
};

exports.toggle_active = async function (req, res) {
  //Should flip assignment's active status
  const assignment = await Assignment.findOne({ _id: req.params.id });
  assignment.active = !assignment.active;
  await assignment.save();
  res.sendStatus(200);
};

exports.details = async function (req, res) {
  const assignment = await Assignment.findById(req.params.id);
  res.status(200).json({ assignment });
};

exports.active_user = async function (req, res) {
  const assignments = await Assignment.find({
    userId: req.params.uid,
    active: true,
  });
  res.status(200).json({ assignments });
};

exports.inactive_user = async function (req, res) {
  const assignments = await Assignment.find({
    userId: req.params.uid,
    active: false,
  });
  res.status(200).json({ assignments });
};

// exports.create = async function(req, res) {
//   const assignment = new Assignment({
//     userId: req.body.userId,
//     choreId: req.body.choreId
//   });

//   await assignment.save();
//   res.status(200).json({ assignment });
// };

// exports.show_all = async function(req, res) {
//   const assignments = await Assignment.find({});
//   res.status(200).json({ assignments });
// };

// exports.delete = async function(req, res) {
//   await Assignment.findOneAndDelete(req.params.id);
//   res.sendStatus(200);
// };
