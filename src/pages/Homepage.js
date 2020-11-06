import React from 'react';
import { useHistory } from 'react-router-dom';
import * as api from '../client/api';
import { useInput } from '../effects/useInput';

export const Homepage = () => {
  const history = useHistory();
  const { value: room_code, bind: bindCode } = useInput('');
  const enteredRoomCode = room_code && room_code.length === 4;

  const joinRoom = () => {
    history.push(`/?${room_code}`);
  };

  const createRoom = async () => {
    const roomInfo = await api.createRoom();
    if (roomInfo) {
      history.push(`/?${roomInfo.room_code}`);
    }
  };

  const textInputPattern = '';
  const toUpperCase = function (e){
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9 !?.'":]/g, '');
  };
  
  return (
    <div className="App">
      <div className="App-header title">
        Netstrations
      </div>
      
      <div className="App-section spaced">
        <label>Room Code:</label>
        <input
          type="text"
          {...bindCode}
          placeholder="CODE"
          pattern={textInputPattern}
          onInput={toUpperCase}
          maxLength={4}
          autoComplete="off"
          spellCheck={false}
          className="font-large"
        />
        <button disabled={!enteredRoomCode} onClick={joinRoom} className="button-primary">Join Game</button>
      </div>
      <div className="App-section">
        <span className="description">Or start a new one ...</span>
        <button onClick={createRoom} className="button-primary">Create Game</button>
      </div>
    </div>
  );
};
