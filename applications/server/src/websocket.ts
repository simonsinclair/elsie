import WebSocket from 'ws';

const PORT = 4000;

class ElsieWebSocket extends WebSocket {
  isAlive?: boolean;
}

const server = new WebSocket.WebSocketServer({
  port: PORT,
  WebSocket: ElsieWebSocket,
});

server.on('connection', (websocket) => {
  websocket.isAlive = true;

  websocket.on('error', (error) => {
    console.error('websocket: error', error);
  });

  websocket.on('message', (data) => {
    const message = data.toString();

    if (message === 'pong') {
      websocket.isAlive = true;
      console.log('websocket: received pong');
    }
  });

  console.log('websocket: connected');
});

const interval = setInterval(() => {
  for (const websocket of server.clients) {
    if (websocket.isAlive) {
      websocket.isAlive = false;
      websocket.send('ping');
      console.log('websocket: sent ping');
    } else {
      websocket.terminate();
      console.log('websocket: terminated');
    }
  }
}, 30_000);

server.on('close', () => {
  console.log('server: closed');
  clearInterval(interval);
});
