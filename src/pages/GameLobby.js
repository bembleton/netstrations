import React, { useCallback, useRef } from 'react';
import { useGameContext } from '../effects/gameContext';
import { useInput } from '../effects/useInput';
import { getSketchbooks } from '../game';
import { IconButton } from '../components/IconButton';
import { copy } from '../components/icons/copy';

const Player = ({ player }) => {
  const { name, avatar_url } = player;
  return (
    <div className="player">
      <img src={avatar_url} alt={name} width={54} height={72} />
      <span className="player-name">{name}</span>
    </div>
  );
};

const Option = ({ label, children }) => {
  return (
    <div className="game-option">
      <label>{label}</label>
      <div className="option-editor">
        {children}
      </div>
    </div>
  );
}

const getTopic = async (filename) => {
  const res = await fetch(`/data/${filename}`);
  return res.json();
}

export function GameLobby({ room_code, players = [] }) {
  const { client, gameState, updateGameState } = useGameContext();
  const { value: drawTime, bind: bindDrawTime } = useInput(120);
  const { value: colorMode, bind: bindColorMode } = useInput('MULTI_COLOR');
  const roomLink = useRef();
  
  const { isHost } = gameState;
  const playerCount = players.length;

  const allPlayers = players.map((x) => {
    return <Player key={x.connectionId} player={x} />
  });

  const canStart = isHost && playerCount > 1;
  const theHost = !isHost && players.find(x => x.isHost);

  const startGame = useCallback(async () => {
    updateGameState({ drawTime: Number(drawTime), game_mode: 'game', round_index: -1 });

    // get some topics
    const topicLists = await Promise.all([
      getTopic('characters.json'),
      getTopic('animals.json'),
      getTopic('random.json')
    ]);
    
    const sketchbooks = getSketchbooks(players, topicLists.flat());

    sketchbooks.forEach(x => {
      const { player } = x.pages[0];
      client.assignSketchbook(player, x);
    });
  }, [client, drawTime, players, updateGameState]);

  const copyLink = () => {
    if (!roomLink && roomLink.current) return;
    roomLink.current.select();
    document.execCommand('copy');
  };

  return (
    <div className="App">
      <div className="App-header">
        Room Code: {room_code}
      </div>
      <div className="players-label">
        <span>Players:</span>
      </div>
      <div className="players-list">
        {allPlayers}
      </div>
      <div className="App-secion spaced">
        <span className="description">Share a link to this  game...</span>
        <div className="roomLink">
          <input type="text" className="roomLink-input" readOnly value={window.location.href} ref={roomLink} />
          <IconButton icon={copy} height={18} width={18} onClick={copyLink} className="roomLink-button"></IconButton>
        </div>
      </div>
      {isHost &&
        <div className="App-section spaced">
          <label>Game Options:</label>
          <Option label="Draw Time">
            <select value={drawTime} {...bindDrawTime}>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
              <option value={0}>no limit</option>
            </select>
          </Option>
          <Option label="Palette">
            <select value={colorMode} {...bindColorMode}>
              <option value="BLACK">Black</option>
              <option value="BLACK_AND_WHITE">Black and White</option>
              <option value="MULTI_COLOR">Multi Color</option>
            </select>
          </Option>
          {/* <Option label="Topics">
            <div className="stack">
              <input type="checkbox" value="Animals" checked />
            </div>
          </Option> */}
          <button
            onClick={startGame}
            disabled={!canStart}
            className="button-primary"
          >
            Start Game
          </button>
        </div>
      }
      {theHost &&
        <div className="App-section spaced">
          <p>Waiting on {theHost.name.toUpperCase()} to start the game already</p>
        </div>
      }
    </div>
  );
}