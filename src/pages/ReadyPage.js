import React, { useState } from 'react';
import classnames from 'classnames';
import { useInterval } from '../effects/useInterval';

const Player = ({ player }) => {
  const { name, avatar_url } = player;
  const status = player.status === 'busy' ? '' : 'READY';
  const busy = player.status === 'busy';

  return (
    <div className={classnames('player', { busy })}>
      <img src={avatar_url} alt={name} width={54} height={72} />
      <span className="player-name">{name}</span>
      <span className="player-status">{status}</span>
    </div>
  );
};

const getRemainingTime = (round_end_time) => {
  if (!round_end_time) return null;
  const remainingMs = round_end_time - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000));
};

export const ReadyPage = ({ players, round_end_time }) => {
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(round_end_time));
  useInterval(200, () => {
    setTimeLeft(getRemainingTime(round_end_time));
  });

  const timeLeftLabel = round_end_time ? (timeLeft+'').padStart(2, '0') : null;

  const playerList = players.map(x => 
    <Player key={x.connectionId} player={x} />
  );
  
  return (
    <div className="App">
      <div className="App-header">
        Waiting for next round
      </div>
      <div className="App-section spaced">
        <div className="players-list">
          {playerList}
        </div>
      </div>
      { round_end_time &&
        <div className="App-section spaced">
          <div className="readyPage-timer">
            <span className="label">Time Remaining:</span>
            <span className="value">{timeLeftLabel}</span>
          </div>
        </div>
      }
    </div>
  );
};
