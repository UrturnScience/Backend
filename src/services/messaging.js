const mongoose = require("mongoose");

const User = require("../models/user.model");
const Message = require("../models/message.model");
const { sendPushNotif } = require("./notif");

async function messageUser(userId, msg) {
  const user = User.findById(userId);
  const ws = User.getWebSocket(userId);

  if (ws) {
    ws.send(msg);
  } else {
    const tickets = await sendPushNotif(msg, user.expoPushTokens);
    console.log(tickets);
  }
}

async function messageUsers(userIds, msg) {
  const data = JSON.stringify(msg);
  return Promise.all(userIds.map((userId) => messageUser(userId, data)));
}

function setupMessagingEvents(ws) {
  ws.on("message", async (data) => {
    const message = new Message({
      data,
      senderId: ws.user._id,
      roomId: await ws.user.getRoomId(),
    });

    const roommateIds = await ws.user.getRoommateIds();
    messageUsers(roommateIds, message.toJSON());

    await message.save();
  });
}

module.exports = { setupMessagingEvents };
