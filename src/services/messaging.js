function messageRoom(roomId) {}

function setupMessagingEvents(ws) {
  ws.on("message", data => {
    const msg = JSON.parse(data);
    console.log(msg);
  });
}

module.exports = { setupMessagingEvents };
