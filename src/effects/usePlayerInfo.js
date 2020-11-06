import { useGameContext } from "./gameContext";
import { useMessage } from "./useMessage";

export const usePlayerInfo = () => {
  const { gameState, updateGameState } = useGameContext();
  const { playerInfo } = gameState;

  useMessage('setPlayerInfo', (playerInfo) => {
    console.log(`[setPlayerInfo]`, playerInfo);
    const { isHost } = playerInfo;
    updateGameState({ isHost, playerInfo });
  });
  
  return playerInfo;
};
