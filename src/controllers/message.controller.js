const Message = require("../models/message.model");

exports.getRoomMessages = async function(req, res) {
  const roomId = req.params.id;
  const messages = await Message.find({ roomId });
  res.status(200).json({ messages });
};
