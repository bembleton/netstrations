import { useAsyncUpdates } from "./useSanity";
import { useGameContext } from "./gameContext";
import { useRoomCode } from "./useRoomCode";
import { useMessage } from "./useMessage";
import * as api from '../client/api';
import { debug } from "./testData";

export const useRoomInfo = () => {
  const room_code = useRoomCode();
  const { client, gameState, updateGameState } = useGameContext();
  const { locked, players } = gameState;
  const roomInfo = players ? { locked, players } : undefined;

  useMessage('setPlayers', (players) => {
    client.connections = players.map(x => x.connectionId);
    updateGameState({ players });
  }, [gameState]);

  // on room_code updated
  useAsyncUpdates(async () => {
    if (!room_code || debug) return;
    const roomInfo = await api.getRoomInfo(room_code);

    if (roomInfo) {
      roomInfo.players.forEach(x => x.status = null);
      updateGameState(roomInfo);
    } else {
      updateGameState({ locked: undefined, players: undefined });
    }
  }, [room_code]);

  return roomInfo;
};
