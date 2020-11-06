import React, { useState } from 'react';
import { useGameContext } from '../effects/gameContext';
import { useTeardown } from '../effects/useSanity';
import { useInput } from '../effects/useInput';

export const GuessPage = ({ playerName, url }) => {
  const { client, gameState, updateGameState } = useGameContext();
  const [isSending, setIsSending] = useState(false);
  const { value: title, bind: bindTitle } = useInput('');
  const { sketchbook, round_index } = gameState;

  const submit = async () => {
    setIsSending(true);

    const page = sketchbook.pages[round_index];
    page.title = title;

    var nextPage = sketchbook.pages[round_index + 1];
    if (nextPage) {
      const { player } = nextPage;
      nextPage.title = title;
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
        {playerName} drew this
      </div>
      <div className="App-section">
        <img src={url} className="netstration-image" alt={`${playerName}'s drawing`} />
      </div>
      <div className="App-section">
        <label>What is this?</label>
        <input
          type="text"
          maxLength={30}
          {...bindTitle}
        />
        <button onClick={submit} disabled={isSending} className="button-primary">Next</button>
      </div>
    </div>
  );
};
