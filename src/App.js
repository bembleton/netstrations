import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { GameStateProvider, useGameContext } from './effects/gameContext';
import { useGameClient } from './effects/useGameClient';
import { useRoomCode } from './effects/useRoomCode';
import { useRoomInfo } from './effects/useRoomInfo';
import { usePlayerInfo } from './effects/usePlayerInfo';
import { Homepage, RegisterPage, GameLobby } from './pages';
import { LockedRoomPage } from './pages/LockedRoomPage';
import './App.css';
import { SketchbookPage } from './pages/SketchbookPage';
import { GameReviewPage } from './pages/GameReviewPage';

const RouteSelector = () => {
  const room_code = useRoomCode();
  const roomInfo = useRoomInfo();
  const playerInfo = usePlayerInfo();
  const { gameState } = useGameContext();
  
  useGameClient();

  const {
    game_mode,
    sketchbook,
    all_sketchbooks,
    round_index,
  } = gameState;

  if (!room_code) {
    return <Homepage />;
  }

  if (!roomInfo) {
    return <LockedRoomPage room_code={room_code} message="Invalid Room Code." />
  }

  const { locked, players } = roomInfo;

  if (!playerInfo && locked) {
    return <LockedRoomPage room_code={room_code} message="This game has already started." />
  }

  if (!playerInfo) {
    return <RegisterPage room_code={room_code} />;
  }

  const { status: playerStatus } = playerInfo;

  if (game_mode === 'lobby') {
    return <GameLobby room_code={room_code} players={players} />;
  }

  if (game_mode === 'game') {
    return (
      <SketchbookPage
        playerStatus={playerStatus}
        sketchbook={sketchbook}
        round_index={round_index}
      />
    );
  }

  if (game_mode === 'review') {
    return <GameReviewPage sketchbooks={all_sketchbooks} />
  }

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
