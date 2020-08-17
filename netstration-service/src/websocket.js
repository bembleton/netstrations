import aws from 'aws-sdk';
import * as messageHandlers from './messages';

const { WEBSOCKET_DOMAIN, STAGE } = process.env;
const gateway = `https://${WEBSOCKET_DOMAIN}/${STAGE}`;

export const send = async (connectionId, message) => {
  console.log(`sending client websocket:`, { gateway, connectionId, message });
  
  const api = new aws.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: gateway,
  });

  const gatewayMessage = {
    ConnectionId: connectionId,
    Data: JSON.stringify(message)
  };

  await api.postToConnection(gatewayMessage).promise();
};

export const sendAll = async (connections, message) => {
  return Promise.all(connections.map(async (x) => send(x, message)))
};

export const handleMessage = async (message) => {
  const { action } = message;
  const handler = messageHandlers[action];
  if (!handler) {
    throw new Error(`Unknown action ${action}`, message);
  }
  console.log(`handling message`, message);

  return handler(message);
};

export const websocket_url = `wss://${WEBSOCKET_DOMAIN}/${STAGE}`;