const Preference = require("../models/preference.model");

exports.create = async function(req, res) {
  const preference = new Preference({
    choreId: req.body.cid,
    userId: req.body.uid,
    weight: req.body.weight
  });

  await preference.save();
  res.status(200).json({ preference });
};

exports.update = async function(req, res) {
  const preference = await Preference.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({ preference });
};

exports.delete = async function(req, res) {
  await Preference.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
};

exports.show_all = async function(req, res) {
  const preferences = await Preference.find({});
  res.status(200).json({ preferences });
};

exports.show_user = async function(req, res) {
  const preferences = await Preference.find({ userId: req.params.uid });
  res.status(200).json({ preferences });
};

exports.show_chore = async function(req, res) {
  const preferences = await Preference.find({ choreId: req.params.cid });
  res.status(200).json({ preferences });
};

exports.show_room = async function(req, res) {
  const preferences = await Preference.findByRoomId(req.params.rid);
  res.status(200).json({ preferences });
};

exports.details = async function(req, res) {
  const preference = await Preference.findOne({ _id: req.params.id });
  res.status(200).json({ preference });
};
