const Assignment = require("../models/assignment.model");
const User = require("../models/user.model");
const Chore = require("../models/chore.model");
const AssignmentService = require("../services/assignment.service");
const { botMessageRoom } = require("../services/bot");

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

exports.toggle_successful = async function (req, res) {
  //Should flip assignment's successful status
  const assignment = await Assignment.findOne({ _id: req.params.id });
  assignment.successful = !assignment.successful;
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

exports.reportAssignment = async function (req, res) {
  const assignment = await Assignment.findById(req.params.id);
  const chore = await Chore.findById(assignment.choreId);
  const user = await User.findById(assignment.userId);
  const roomId = await user.getRoomId();
  const firebaseUser = await user.getFirebaseUser();
  const userEmail = firebaseUser.email;

  // send bot notification
  let msgText;
  switch (req.body.status) {
    case "wrong":
      msgText = `${userEmail}, it seems you improperly did the chore: ${chore.name}. Please redo it!`;
      break;
    case "late":
      msgText = `${userEmail}, it seems you still have not done the chore: ${chore.name}. Please complete it on time!`;
      break;
    default:
      throw Error(`invalid status: ${req.body.status}`);
  }

  await botMessageRoom(roomId, { data: msgText });
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
