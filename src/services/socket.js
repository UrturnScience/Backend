const WebSocket = require("ws");
const messaging = require("./messaging");
const User = require("../models/user.model");

function setupSocket(server, sessionParser) {
  const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("upgrade", (request, socket, head) => {
    sessionParser(request, {}, () => {
      if (!request.session.userId) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function(ws) {
        wss.emit("connection", ws, request);
      });
    });
  });

  wss.on("connection", async (ws, request, client) => {
    ws.user = await User.findById(request.session.userId);
    User.setWebSocket(request.session.userId, ws);

    messaging.setupMessagingEvents(ws);

    console.log("User " + request.session.userId + " is connected!");
  });
}

module.exports = { setupSocket };
