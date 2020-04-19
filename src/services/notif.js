const { Expo } = require("expo-server-sdk");

let expo = new Expo();

async function sendPushNotif(message, user) {
  const pushTokens = user.expoPushTokens;

  // Create the messages that you want to send to clients
  let messages = [];
  for (let pushToken of pushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      // remove it from user
      user.expoPushTokens.remove(pushToken);
    } else {
      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications)
      message.to = pushToken;
      messages.push(message);
    }
  }

  await user.save(); // save if needed to remove push tokens

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      console.error(error);
    }
  }

  return tickets;
}

module.exports = {
  sendPushNotif,
};
