import React, { useState } from 'react';
import { NestrationCanvas } from '../components/NestrationCanvas';
import * as imageUploader from '../client/imageUploader';
import { useGameContext } from '../effects/gameContext';
import { useTeardown } from '../effects/useSanity';
import { useRoomCode } from '../effects/useRoomCode';

export const DrawPage = ({ title }) => {
  const room_code = useRoomCode();
  const { client, gameState, updateGameState } = useGameContext();
  const [isSending, setIsSending] = useState(false);
  const { round_index, round_end_time, sketchbook } = gameState;
  
  const submit = async (blob) => {
    setIsSending(true);
    
    const url = await imageUploader.upload(room_code, title, blob);
    const page = sketchbook.pages[round_index];
    page.url = url;

    var nextPage = sketchbook.pages[round_index + 1];
    if (nextPage) {
      const { player } = nextPage;
      nextPage.url = url;
      client.assignSketchbook(player, sketchbook);
    } else {
      // give it back to the first player
      const owner = sketchbook.pages[0].player;
      client.assignSketchbook(owner, sketchbook);
    }

    updateGameState({ sketchbook: null });
  };

  useTeardown(() => {
    setIsSending(false);
  });
  
  return (
    <div className="App">
      <div className="App-header">
        {title}
      </div>
      <div className="App-section">
        <NestrationCanvas onSubmit={submit} disabled={isSending} round_end_time={round_end_time} />
      </div>
    </div>
  );
};
