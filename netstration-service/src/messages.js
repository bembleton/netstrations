import { send, sendAll } from './websocket';
import { addPlayerToRoom } from './game';

/** Called immediately after a client connects */
export const completeConnection = async (message) => {
  const { connectionId } = message;
  const resp = {
    action: 'completeConnection',
    data: { connectionId }
  };

  await send(connectionId, resp)
}

export const ping = async () => {};

export const relay = async ({ data }) => {
  const { connectionId: recipient, message } = data;
  await send(recipient, message);
};

export const broadcast = async ({ data }) => {
  const { connections, message } = data;
  await sendAll(connections, message);
};

// /** Gets a list of registered players */
// export const getRoomInfo = async (message) => {
//   const { connectionId, room_code } = message;
//   const room = await getRoom(room_code);
//   const resp = {
//     action: 'setRoomInfo',
//     data: room
//   };
//   await send(connectionId, resp);
// };


/** Registers a player in a room and notifies the other players */
export const registerPlayer = async (message) => {
  const { connectionId, room_code, data: player } = message;
  player.connectionId = connectionId;
  await addPlayerToRoom(room_code, player);
};