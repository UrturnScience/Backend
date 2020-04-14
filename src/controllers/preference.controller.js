const Preference = require("../models/preference.model");
const RoomUser = require("../models/room_user.model");
const Chore = require("../models/chore.model");

const PreferenceService = require("../services/preference.service");

//Takes a list of preferences for a user and reorders them according to list's ordering
exports.update = async function(req, res) {
  await PreferenceService.updatePreferences(req.params.uid, req.body.preferenceIds);
  res.sendStatus(200);
};

exports.upcoming_preferences = async function(req, res){
  const preferences = await PreferenceService.getUpcomingPreferences(req.params.uid);

  res.status(200).json({preferences});
}

exports.details = async function(req, res) {
  const preference = await Preference.findOne({ _id: req.params.id });
  res.status(200).json({ preference });
};

// exports.create = async function(req, res) {
//   const preference = new Preference({
//     choreId: req.body.cid,
//     userId: req.body.uid,
//     weight: req.body.weight
//   });

//   await preference.save();
//   res.status(200).json({ preference });
// };

// exports.delete = async function(req, res) {
//   await Preference.findOneAndDelete(req.params.id);
//   res.sendStatus(200);
// };

// exports.show_all = async function(req, res) {
//   const preferences = await Preference.find({});
//   res.status(200).json({ preferences });
// };

// exports.show_user = async function(req, res) {
//   const preferences = await Preference.find({ userId: req.params.uid });
//   res.status(200).json({ preferences });
// };

// exports.show_chore = async function(req, res) {
//   const preferences = await Preference.find({ choreId: req.params.cid });
//   res.status(200).json({ preferences });
// };

// exports.show_room = async function(req, res) {
//   const preferences = await Preference.findByRoomId(req.params.rid);
//   res.status(200).json({ preferences });
// };
