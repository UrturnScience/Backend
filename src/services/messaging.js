const User = require("../models/user.model");
const mongoose = require("mongoose");

function pushNotification(userId) {}

async function messageUser(userId, msg) {
  const ws = User.getWebSocket(userId);

  if (ws) {
    console.log(msg, "to", userId);
    ws.send(msg);
  }else{
    /**
     * TODO: send push notification to user
     */
  }
}

async function messageUsers(userIds, msg) {
  const data = JSON.stringify(msg);
  return Promise.all(userIds.map(userId => messageUser(userId, data)));
}

function setupMessagingEvents(ws) {
  ws.on("message", async data => {
    const msg = { data };
    msg.sender = ws.user._id;

    const roommateIds = await ws.user.getRoommateIds();

    messageUsers(roommateIds, msg);
  });
}

module.exports = { setupMessagingEvents };
