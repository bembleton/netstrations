import React from 'react';
import { Link } from 'react-router-dom';

export function LockedRoomPage({ room_code, message }) {
  return (
    <div className="App">
      <div className="App-header">
        Room: {room_code}
      </div>
      <div>
        <span>{message}</span>
      </div>
      <Link path="/">Return to the Homepage</Link>
    </div>
  );
}