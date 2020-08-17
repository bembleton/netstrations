import React from 'react';
import { Link } from 'react-router-dom';

export function LockedRoomPage({ room_code, message }) {
  return (
    <div className="App">
      <header className="App-header">
        Room: {room_code}
      </header>
      <div>
        <span>{message}</span>
      </div>
      <Link path="/">Return to the Homepage</Link>
    </div>
  );
}