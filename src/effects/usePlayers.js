import { useGameContext } from "./gameContext";

export const usePlayers = () => {
  const { gameState } = useGameContext();
  const { players } = gameState;

  // all players have next_sketchbook set and are ready to start the next round
  const ready = players && players.length > 0 && players.every(x => x.status === 'ready');

  return { players, ready };
};
