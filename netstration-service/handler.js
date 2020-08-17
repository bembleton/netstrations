import { getRoomCode, removeConnection } from './src/database/connections';
import * as game from './src/game';
import { send, handleMessage } from './src/websocket';
import { getSignedUrls } from './src/signedUrls';

const ok = (body) => ({
  statusCode: 200,
  body: body ? JSON.stringify(body) : ''
});

// POST /games
export const createGame = async (event) => {
  const gameInfo = await game.createGame();
  
  return {
    statusCode: 201,
    body: JSON.stringify(gameInfo),
  };
};

const matches = (event, method, path) => {
  const { httpMethod, path: url } = event;
  if (httpMethod !== method) return false;
  return new RegExp(path).test(url);
};

const response = (statusCode, data, options = {}) => {
  const res = {
    statusCode,
    ...options,
    body: data ? JSON.stringify(data) : ''
  };
  const { headers } = options;
  res.headers = {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  return res;
}

export const api = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return response(200)
  }

  if (matches(event, 'POST', '/api/games')) {
    const gameInfo = await game.createGame();
    return response(201, gameInfo);
  }

  if (matches(event, 'GET', '/api/signedUrl')) {
    const { queryStringParameters: { key } } = event;
    const urls = await getSignedUrls(key);

    return response(200, urls);
  }

  if (matches(event, 'GET', '/api/roomInfo')) {
    const { queryStringParameters: { room_code } } = event;
    const room = await game.getRoomInfo(room_code)
    return response(200, room);
  }
  
  return {
    statusCode: 404,
    body: 'Not found',
  }
};

export const connectWS = async (event) => {
  console.log(`websocket connection`, event);

  const {
    requestContext: { connectionId },
  } = event;

  console.log(`websocket connected: ${connectionId}`);
  return ok();
};

export const handleWS = async (event) => {
  console.log(`websocket event`, event);

  const {
    requestContext: { connectionId },
    body
  } = event;

  const {
    room_code,
    action,
    data
  } = JSON.parse(body);

  const message = { connectionId, room_code, action, data };
  await handleMessage(message);

  return ok();
};

export const disconnectWS = async (event) => {
  console.log(`websocket disconnection`, event);

  const {
    requestContext: { connectionId },
  } = event;

  await game.removePlayer(connectionId);

  console.log(`websocket disconnected: ${connectionId}`);
  return ok();
};