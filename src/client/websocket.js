import { ServiceEndpointWebsocket } from './stack.json';

const _verbose = Symbol();
const _pendingMessages = Symbol();
const _handlers = Symbol();
const _client = Symbol();

const getProtected = function(obj) {
  const verbose = obj[_verbose];
  const pendingMessages = obj[_pendingMessages];
  const handlers = obj[_handlers];
  const client = obj[_client];
  return { verbose, pendingMessages, handlers, client };
};

export class Client {
  constructor () {
    this.room_code = null;
    this.connectionId = null;
    this.connections = [];

    this[_verbose] = true;
    this[_pendingMessages] = [];
    this[_handlers] = {};

    let client;

    client = new WebSocket(ServiceEndpointWebsocket);
    this[_client] = client;

    client.onopen = () => {
      console.log(`[Websocket Client Connected]`);
      this.send('completeConnection', {});
    };

    client.onmessage = (ev) => {
      const { pendingMessages, handlers } = getProtected(this);
      let message;
      
      try {
        message = JSON.parse(ev.data);
      } catch (e) {
        console.log(`[Client Error] Failed to parse message: ${e.message}`);
        console.log(`message: ${ev}`);
        throw e;
      }

      const { action, data } = message;

      try {
        if (action === 'completeConnection') {
          this.connectionId = data.connectionId;
          while (pendingMessages.length) {
            const { action, data } = pendingMessages.shift();
            this.send(action, data);
          }
          return;
        }
     
        const handler = handlers[action];
        if (handler) {
          handler(data);
        } else {
          console.log(`[Unhandled Action] action: ${action}, message:`, message);
        }

      } catch (e) {
        console.log(`[Action Error] ${action}`);
        console.log(e);
      }
    };

    client.onerror = (err) => {
      console.log(`[Client Error] `, err);
    }

    client.onclose = (err) => {
      console.log(`[Client Closed]`);
      this.connectionId = null;
    }

    this.pingEvent = setInterval(this.ping.bind(this), 60000);
  }

  addMessageHandler (action, callback) {
    const { handlers } = getProtected(this);
    handlers[action] = callback;
  }

  removeMessageHandler (action) {
    const { handlers } = getProtected(this);
    delete handlers[action];
  }

  disconnect () {
    const { client } = getProtected(this);
    client.close();
    clearInterval(this.pingEvent);
  }

  ping () {
    this.send('ping');
  }

  send (action, data) {
    const { client, pendingMessages, verbose } = getProtected(this);
    const { room_code } = this;

    if ([client.CLOSED, client.CLOSING].some(x=> x === client.readyState)) {
      console.log(`[Client Error] Cant send while disconnected: ${action}`);
      return;
    }
    if (client.readyState !== client.OPEN) {
      pendingMessages.push({ action, data });
      return;
    }
    const message = { room_code, action, data };
    if (verbose) {
      //console.log(`[Sending Message] ${action}`);
      //console.log(message);
    }
    client.send(JSON.stringify(message));
  }

  sendToPlayer (player, action, data) {
    const message = {
      connectionId: player.connectionId,
      message: { action, data }
    };
    this.send('relay', message);
  }

  broadcast (action, data)  {
    const message = {
      connections: this.connections,
      message: { action, data }
    };
    this.send('broadcast', message);
  }
}
