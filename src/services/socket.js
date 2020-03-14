const WebSocket = require("ws");

function setupSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", ws => {});
}

module.exports = { setupSocket };
