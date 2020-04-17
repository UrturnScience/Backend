const User = require("../models/user.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

function pushNotification(userId) {}

async function messageUser(userId, msg) {
  const ws = User.getWebSocket(userId);

  if (ws) {
    ws.send(msg);
  } else {
    /**
     * TODO: send push notification to user
     */
  }
}

async function messageUsers(userIds, msg, giftedId) {
  msg.giftedId = giftedId;
  const data = JSON.stringify(msg);
  return Promise.all(userIds.map(userId => messageUser(userId, data)));
}

function setupMessagingEvents(ws) {
  ws.on("message", async data => {
    const dataJson = JSON.parse(data);

    const message = new Message({
      data: dataJson.message,
      senderId: ws.user._id,
      roomId: await ws.user.getRoomId()
    });

    const roommateIds = await ws.user.getRoommateIds();
    messageUsers(roommateIds, message.toJSON(), dataJson.giftedId);

    await message.save();
  });
}

module.exports = { setupMessagingEvents };
