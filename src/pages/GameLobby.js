import React from 'react';
import { useGameContext } from '../effects/gameContext';
import * as latinSquares from '../latinSquares';

const Player = ({ player }) => {
  const { name, avatar_url } = player;
  return (
    <div className="player">
      <img src={avatar_url} alt="Player Avatar" width={64} height={64} />
      <span className="label">{name}</span>
    </div>
  );
};

export function GameLobby({ room_code, playerInfo, players }) {
  const { gameState } = useGameContext();
  const { isHost } = playerInfo;
  const playerCount = players.length;

  const allPlayers = players.map((x) => {
    return <Player key={x.connectionId} player={x} />
  });

  const canStart = isHost && playerCount > 1;

  const startGame = () => {
    // generate assignment matrix
    const squares = latinSquares.generate(playerCount);
    // get some topics
    // assign each player a chain
    // send 
  };

  return (
    <div className="App">
      <header className="App-header">
        Room Code: {room_code}
      </header>
      <div className="players-label">
        <span>Players:</span>
      </div>
      <div className="players-list">
        {allPlayers}
      </div>
      <div>
        <button onClick={startGame} disabled={!canStart}>Start Game</button>
      </div>
    </div>
  );
}