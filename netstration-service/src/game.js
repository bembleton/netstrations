import { createRoom, getRoom, updateRoom } from './database/rooms';
import { addConnection, removeConnection, getRoomCode } from './database/connections';
import { send, sendAll } from './websocket';

export const createGame = async () => {
  return createRoom();
};

export const getRoomInfo = async (room_code) => {
  try {
    return await getRoom(room_code);
  } catch (e) {
    console.log('failed to getRoomInfo', e);
  }
};

export const addPlayerToRoom = async (room_code, player) => {
  const { connectionId } = player;
  const connection = { connectionId, room_code };
  await addConnection(connection);

  const room = await getRoom(room_code);
  if (room === null) return;
  
  const { players = [] } = room;
  const isHost = players.length === 0; // first to join
  player.isHost = isHost;
  players.push(player);
  await updateRoom(room);

  console.log(`Player joined game`, { room_code, player });
  
  await send(connectionId, {
    action: 'setPlayerInfo',
    data: player
  });
  
  const connections = players.map(x => x.connectionId);
  const event = {
    action: 'setPlayers',
    data: players
  }

  await sendAll(connections, event);
};

export const removePlayer = async (connectionId) => {
  const room_code = await getRoomCode(connectionId);
  if (room_code === null) return;
  const room = await getRoom(room_code);
  if (room === null) return;
  
  const { players = [] } = room;
  const player = players.find(x => x.connectionId === connectionId);
  if (!player) return;
  const wasHost = player.isHost;

  const remainingPlayers = players.filter(x => x.connectionId !== connectionId);
  if (wasHost && remainingPlayers[0]) {
    const newHost = remainingPlayers[0];
    newHost.isHost = true;
    await send(newHost.connectionId, { action: 'setPlayerInfo', data: newHost });
  }
  room.players = remainingPlayers;
  
  await Promise.all([
    updateRoom(room),
    removeConnection(connectionId)
  ]);
  
  console.log(`Player left the game`, { player, room_code });

  const connections = room.players.map(x => x.connectionId);
  if (connections.length) {
    const event = {
      action: 'setPlayers',
      data: room.players
    }
    await sendAll(connections, event);
  } else {
    // todo: delete room?
  }
};