import WebSocket from 'ws';

import { client } from './database';

const PORT = 4000;

const server = new WebSocket.WebSocketServer({
  port: PORT,
});

/**
 * The period (in ms) given to clients to communicate with the server before
 * their connections are terminated. This should be equal to the interval
 * clients issues pings, plus a conservative assumption of the latency.
 */
const TIMEOUT_MS = 32_000;

server.on('listening', async () => {
  await client.listen('table_actions_insert', (value) => {
    console.log('notification', value);
    /**
     * @todo Send `value` to all connected websocket clients.
     */
  });
});

server.on('connection', (websocket) => {
  console.log('websocket server: connection');

  let timeout = setTimeout(() => {
    websocket.terminate();
    console.log('websocket: terminated');
  }, TIMEOUT_MS);

  websocket.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'initialise') {
        websocket.send(JSON.stringify({ type: 'initialise' }));
      }

      if (data.type === 'ping') {
        websocket.send(JSON.stringify({ type: 'pong' }));

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          websocket.terminate();
          console.log('websocket: terminated');
        }, TIMEOUT_MS);
      }
    } catch (error) {
      console.error(`websocket: invalid message`);
    }
  });

  websocket.on('error', (error) => {
    console.error('websocket: error', error);
  });

  websocket.on('close', () => {
    console.log('websocket: closed');
    clearTimeout(timeout);
  });
});

server.on('close', () => {
  console.log('websocket server: closed');
});
