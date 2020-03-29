import { wsUrl } from "./request";
let ws;

export function connect() {
  ws = new WebSocket(wsUrl);

  ws.onopen = e => {
    //console.log('wsopen', e);
  }

  ws.onmessage = e => {
    console.log('wsmessage', e);
  };

  ws.onerror = e => {
    //console.log('wserror', e);
  };

  ws.onclose = e => {
    //console.log('wsclose', e);
  };
}

export function getWebSocket() {
  return ws;
}
