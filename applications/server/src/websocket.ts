import WebSocket from 'ws';
import { desc, gt } from 'drizzle-orm';

import { database } from './database';
import { actions } from './database/schema';

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
const POLL_TIMEOUT_MS = 2_500;

let latestActionId: number | null = null;
let pollTimeout: ReturnType<typeof setTimeout>;

const poll = async () => {
  try {
    const result =
      latestActionId === null
        ? await database.select().from(actions).orderBy(actions.id)
        : await database
            .select()
            .from(actions)
            .where(gt(actions.id, latestActionId))
            .orderBy(actions.id);

    if (result.length > 0) {
      for (const client of server.clients) {
        if (client.OPEN) {
          client.send(JSON.stringify({ type: 'actions', actions: result }));
        }
      }

      latestActionId = result[result.length - 1].id;
    }
  } catch (error) {
    console.error('poll_error', error);
  } finally {
    pollTimeout = setTimeout(poll, POLL_TIMEOUT_MS);
  }
};

server.on('listening', async () => {
  try {
    const result = await database
      .select({ id: actions.id })
      .from(actions)
      .orderBy(desc(actions.id))
      .limit(1);
    if (result.length === 1) latestActionId = result[0].id;

    /**
     * @todo
     * We only poll() when fetching the latest action succeeds. If it fails,
     * we'll never send actions - we should probably implement a retry.
     */
    poll();
  } catch (error) {
    console.error('latest_action_id_error', error);
  }
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
        websocket.send(JSON.stringify({ type: 'initialise', latestActionId }));
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
  clearTimeout(pollTimeout);
  console.log('websocket server: closed');
});
