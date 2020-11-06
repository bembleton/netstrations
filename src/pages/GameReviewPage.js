import React, { useState } from 'react';
import { SketchbookReviewPage } from './SketchbookReviewPage';
import { useGameContext } from '../effects/gameContext';

export const GameReviewPage = ({ sketchbooks }) => {
  const { client, gameState } = useGameContext();
  const [index, setIndex] = useState(0);

  const { isHost } = gameState;

  const sketchbook = sketchbooks[index];
  const next = () => {
    window.scroll(0,0);
    setIndex((index+1) % sketchbooks.length);
  }
  const prev = () => {
    window.scroll(0,0);
    setIndex((index-1 + sketchbooks.length) % sketchbooks.length);
  }
  const restart = () => {
    client.broadcast('restart');
  };

  return (
    <div className="App scrolling">
      <div className="App-header">
        Game Finished
      </div>
      <SketchbookReviewPage sketchbook={sketchbook} next={next} prev={prev} />
      <div className="sketchbook-nav">
        <button className="sketchbookReview-button" onClick={prev}>Previous</button>
        <button className="sketchbookReview-button" onClick={next}>Next</button>
      </div>
      { isHost &&
        <div className="sketchbook-nav">
          <button className="button-primary" onClick={restart}>Play Again</button>
        </div>
      }
    </div>
  );
};
