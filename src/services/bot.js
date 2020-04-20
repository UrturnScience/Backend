const mongoose = require("mongoose");
const RoomUser = require("../models/room_user.model");
const Message = require("../models/message.model");
const { messageUsers } = require("./messaging");

const BOT_ID = mongoose.Types.ObjectId("000000000000000000000000");

async function botMessageRoom(roomId, msgObj, isSystemMsg) {
  const message = new Message({
    ...msgObj,
    system: isSystemMsg,
    senderId: BOT_ID,
    roomId,
  });
  const msgJSON = message.toJSON();

  const userIds = await RoomUser.getUserIdsByRoomId(roomId);

  messageUsers(isSystemMsg ? "System" : "Roomy Rhino", userIds, msgJSON, "-1");

  await message.save();
}

module.exports = { botMessageRoom };
