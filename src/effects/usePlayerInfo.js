import { useGameContext } from "./gameContext";
import { useMessage } from "./useMessage";

export const usePlayerInfo = () => {
  const { gameState, updateGameState } = useGameContext();
  const { playerInfo } = gameState;

  useMessage('setPlayerInfo', (data) => {
    updateGameState({ playerInfo: data });
  });
  
  return playerInfo;
};
