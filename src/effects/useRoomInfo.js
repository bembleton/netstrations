import { useAsyncUpdates } from "./useSanity";
import { useGameContext } from "./gameContext";
import { useRoomCode } from "./useRoomCode";
import { useMessage } from "./useMessage";
import * as api from '../client/api';

export const useRoomInfo = () => {
  const room_code = useRoomCode();
  const { gameState, updateGameState } = useGameContext();
  const { locked, players } = gameState;
  const roomInfo = players ? { locked, players } : undefined;

  useMessage('setPlayers', (players) => {
    console.log('players updated', players);
    updateGameState({ players });
  });

  // on room_code updated
  useAsyncUpdates(async () => {
    if (!room_code) return;
    const roomInfo = await api.getRoomInfo(room_code);
    if (roomInfo) {
      updateGameState(roomInfo);
    } else {
      updateGameState({ locked: undefined, players: undefined });
    }
  }, [room_code]);

  return roomInfo;
};
