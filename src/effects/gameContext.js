import React, { createContext, useState, useMemo, useContext, useCallback } from 'react';
import { GameClient } from '../client/gameClient';
import { mergeDeep } from '../utils';
import { useTeardown } from './useSanity';

const initialState = {
  playerInfo: null,
  players: []
};

export const gameContext = createContext(initialState);
const { Provider } = gameContext;

const client = new GameClient();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialState);
  
  const updateGameState = useCallback((updates) => {
    const newState = mergeDeep(gameState, updates);
    setGameState({ ...newState });
  }, [gameState]);

  useTeardown(() => {
    client.disconnect();
  });
  
  const contextValue = useMemo(() => {
    return { client, gameState, updateGameState };
  }, [gameState, updateGameState]);

return <Provider value={contextValue}>{children}</Provider>;
}

export const useGameContext = () => {
  return useContext(gameContext);
}

// export const Thing = () => {
//   const { updateGameState } = useGameContext();

//   useEffect(() => {
//     const newState = { loaded: true, playerInfo: { name: 'Thing One'} };
//     updateGameState(newState);
//   });
// }
