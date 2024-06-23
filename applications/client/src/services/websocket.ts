import { serverMessageSchema } from '../types';

type HandleData = (data: Record<string, unknown>) => void;

export class WebSocketClient {
  static reconnectTimeout = 2000;
  private websocket: WebSocket | null;
  private handleData: HandleData;
  private recreateScheduled = false;
  state: 'INITIALISING' | 'READY' | 'CLOSED';

  constructor(handleData: HandleData) {
    this.websocket = null;
    this.handleData = handleData;
    this.state = 'INITIALISING';

    this.create();
  }

  private create = () => {
    if (this.websocket) {
      this.websocket.removeEventListener('open', this.onOpen);
      this.websocket.removeEventListener('message', this.onMessage);
      this.websocket.removeEventListener('close', this.onClose);
      this.websocket.removeEventListener('error', this.onError);
      try {
        this.websocket.close();
      } catch {
        // no-op
      }
    }
    this.websocket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_URL);
    this.websocket.addEventListener('open', this.onOpen);
    this.websocket.addEventListener('message', this.onMessage);
    this.websocket.addEventListener('close', this.onClose);
    this.websocket.addEventListener('error', this.onError);

    /**
     * @todo WebSocket creation might fail, but we still log this.
     */
    console.log('websocket: created');
  };

  /**
   * @todo Empty buffer
   */
  private onOpen = (event: Event) => {
    console.log('websocket: event', event.type);

    this.state = 'READY';
    this.send({ type: 'initialise' });
  };

  private onMessage = (event: MessageEvent<string>) => {
    console.log('websocket: event', event.type);

    try {
      const data = serverMessageSchema.parse(JSON.parse(event.data));
      this.handleData(data);
    } catch (error) {
      console.error('websocket: invalid message', error);
    }
  };

  private onClose = (event: CloseEvent) => {
    console.log('websocket: event', event.type, event.code, event.reason);

    this.state = 'CLOSED';

    if (!this.recreateScheduled) {
      setTimeout(() => {
        this.recreateScheduled = false;
        this.create();
      }, WebSocketClient.reconnectTimeout);
      this.recreateScheduled = true;
    }
  };

  private onError = (event: Event) => {
    console.error('websocket: event', event.type);

    if (!this.recreateScheduled) {
      setTimeout(() => {
        this.recreateScheduled = false;
        this.create();
      }, WebSocketClient.reconnectTimeout);
      this.recreateScheduled = true;
    }
  };

  /**
   * @todo If not 'READY', send data to buffer
   */
  send = (data: Record<string, unknown>) => {
    this.websocket?.send(JSON.stringify(data));
  };

  close = (parameters: Parameters<WebSocket['close']>) => {
    this.websocket?.close(...parameters);
  };
}
