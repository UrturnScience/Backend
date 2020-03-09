const User = require("../models/preference.model");

exports.create = async function(req, res) {
  const preference = new RoomUser({
    choreId: req.body.cid,
    userId: req.body.uid,
    weight: req.body.weight
  });

  await preference.save();
  res.status(200).json({ preference });
};
