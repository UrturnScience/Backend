function messageRoom(roomId, msg) {
  // get all the users that are in the roomId
  // get the user sockets and send the msg
  // if the user socket does not exist, send a FCM push notification
  // create message in database
}

function subscribeToRoom(user, roomId) {}

function setupMessagingEvents(ws) {
  ws.on("message", data => {
    const msg = JSON.parse(data);
    msg.sender = ws.user.uid;

    messageRoom();
  });
}

module.exports = { setupMessagingEvents };
