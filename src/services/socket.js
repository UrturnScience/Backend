const WebSocket = require("ws");
const messaging = require("./messaging");
const usersSocket = new Map(); // key is UID, value is websocket instance

function getUsersSocket(uid) {
  return usersSocket.get(uid);
}

function setupSocket(server) {
  const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("upgrade", (request, socket, head) => {
    /**
     * TODO Add Authentication with firebase
     * setting the session value to user
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

  wss.on("connection", (ws, request, client) => {
    const user = request.session.user;
    ws.user = user;
    usersSocket.set(user.uid, ws);

    messaging.setupMessagingEvents(ws);

    ws.on("close", () => {});
  });
}

module.exports = { setupSocket, getUsersSocket };
