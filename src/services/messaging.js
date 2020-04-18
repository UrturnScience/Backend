const mongoose = require("mongoose");

const User = require("../models/user.model");
const Message = require("../models/message.model");
const { sendPushNotif } = require("./notif");

async function messageUser(senderEmail, userId, msg) {
  const user = await User.findById(userId);
  const ws = User.getWebSocket(userId);

  if (ws) {
    ws.send(msg);
  } else {
    const pushNotif = {
      sound: "default",
      title: senderEmail,
      body: msg.data,
      data: msg,
    };
    const tickets = await sendPushNotif(pushNotif, user.expoPushTokens);
    console.log(tickets);
  }
}

async function messageUsers(senderEmail, userIds, msg, giftedId) {
  msg.giftedId = giftedId;
  const data = JSON.stringify(msg);
  return Promise.all(
    userIds.map((userId) => messageUser(senderEmail, userId, data))
  );
}

function setupMessagingEvents(ws) {
  ws.on("message", async (data) => {
    const dataJson = JSON.parse(data);

    const message = new Message({
      data: dataJson.message,
      senderId: ws.user._id,
      roomId: await ws.user.getRoomId(),
    });

    const firebaseUser = await ws.user.getFirebaseUser();
    const roommateIds = await ws.user.getRoommateIds();
    messageUsers(
      firebaseUser.email,
      roommateIds,
      message.toJSON(),
      dataJson.giftedId
    );

    await message.save();
  });
}

module.exports = { setupMessagingEvents };
