const WebSocket = require("ws");
const messaging = require("./messaging");
const User = require("../models/user.model");

const WS_CLIENT_TIMEOUT = process.env.WS_CLIENT_TIMEOUT || 3000;

function setupSocket(server, sessionParser) {
  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    sessionParser(request, {}, () => {
      if (!request.session.userId) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit("connection", ws, request);
      });
    });
  });

  wss.on("connection", async (ws, request, client) => {
    ws.isAlive = true;
    ws.user = await User.findById(request.session.userId);
    User.setWebSocket(request.session.userId, ws);

    messaging.setupMessagingEvents(ws);

    ws.on("close", (code, reason) => {
      User.destroyWebSocket(request.session.userId);
    });

    ws.on("pong", () => {
      ws.isAlive = true;
    });
  });

  // handle broken connections
  const interval = setInterval(function ping() {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        User.destroyWebSocket(ws.user._id);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, WS_CLIENT_TIMEOUT);

  wss.on("close", () => {
    clearInterval(interval);
  });
}

module.exports = { setupSocket };
