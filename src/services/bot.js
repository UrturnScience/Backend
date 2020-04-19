const mongoose = require("mongoose");
const RoomUser = require("../models/room_user.model");
const Message = require("../models/message.model");
const { messageUsers } = require("./messaging");

const BOT_ID = mongoose.Types.ObjectId("000000000000000000000000");

async function botMessageRoom(roomId, msgText, isSystemMsg) {
  const message = new Message({
    data: msgText,
    senderId: BOT_ID,
    roomId,
  });
  const msgJSON = message.toJSON();
  if (isSystemMsg) {
    msgJSON.system = isSystemMsg;
  }

  const userIds = await RoomUser.getUserIdsByRoomId(roomId);

  messageUsers("bot", userIds, msgJSON, "-1");

  await message.save();
}

module.exports = { botMessageRoom };
