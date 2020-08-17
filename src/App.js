import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { GameStateProvider } from './effects/gameContext';
import { useRoomCode } from './effects/useRoomCode';
import { useRoomInfo } from './effects/useRoomInfo';
import { usePlayerInfo } from './effects/usePlayerInfo';
import { Homepage, RegisterPage, GameLobby } from './pages';
import { LockedRoomPage } from './pages/LockedRoomPage';
import './App.css';

const RouteSelector = () => {
  const room_code = useRoomCode();
  const roomInfo = useRoomInfo();
  const playerInfo = usePlayerInfo();

  if (!room_code) {
    return <Homepage />;
  }

  if (!roomInfo) {
    return <LockedRoomPage room_code={room_code} message="Invalid Room Code." />
  }

  const { locked, players } = roomInfo;
  
  if (locked) {
    return <LockedRoomPage room_code={room_code} message="This game has already started." />
  }

  if (!playerInfo) {
    return <RegisterPage room_code={room_code} />;
  }

  return <GameLobby room_code={room_code} playerInfo={playerInfo} players={players} />;
}

function App() {
  return (
    <GameStateProvider>
      <Router>
        <RouteSelector /> 
      </Router>
    </GameStateProvider>
  );
}

export default App;
