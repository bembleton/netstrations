import React, { createContext, useState, useMemo, useContext, useCallback } from 'react';
import { GameClient } from '../client/gameClient';
import { mergeDeep } from '../utils';
import { useTeardown } from './useSanity';
import { debug, testData } from './testData';

// const player = {
//   connectionId: '',
//   name: '',
//   avatar_url: '',
//   status: 'ready|busy|waiting' 
// };
// status     sketchbooks
//            next  current
// ready      {}    null
// busy       *     {}
// waiting    null  null

const initData = {
  playerInfo: null,
  players: [],
  isHost: false,
  game_mode: 'lobby', // lobby|game|review
  round_index: 0,
  round_stop_time: null,
  sketchbook: null,
  next_sketchbook: null,
  all_sketchbooks: []
};

// const sketchbook = {
//   title: null,
//   pages: [
//     { type: 'draw', player: {}, url: null, title: null },
//     { type: 'guess', player: {}, url: null, title: null }
//   ]
// }

const initialState = debug ? testData : initData;

export const gameContext = createContext(initialState);
const { Provider } = gameContext;

const client = new GameClient();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialState);
  
  const updateGameState = useCallback((updates) => {
    const merged = mergeDeep(gameState, updates);
    const newState = { ...merged };
    console.log(JSON.stringify(newState));
    setGameState(newState);
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
