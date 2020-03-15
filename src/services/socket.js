const WebSocket = require("ws");
const messaging = require("./messaging");

function setupSocket(server) {
  const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("upgrade", (request, socket, head) => {
    /**
     * TODO Add Authentication with firebase
     * https://github.com/websockets/ws#client-authentication
     */
    function authenticate(req, callback) {
      callback(null, {});
    }

    authenticate(request, (err, client) => {
      if (err || !client) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request, client);
      });
    });
  });

  wss.on("connection", (ws, request) => {
    messaging.setupMessagingEvents(ws);

    ws.on("close", () => {});
  });
}

module.exports = { setupSocket };
