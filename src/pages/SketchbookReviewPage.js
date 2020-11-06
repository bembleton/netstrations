import React from 'react';
import { SketchbookTitle } from '../components/SketchbookTitle';
import { SketchbookGuess } from '../components/SketchbookGuess';

const getPage = (p, i) => {
  const { type, player, url, title } = p;
  const { name: playerName } = player;
  if (type === 'draw') {
    return (
      <div key={i} className="App-section">
        <label><span><span className="uppercase playername">{playerName}</span> drew:</span></label>
        <img src={url} className="netstration-image" alt={`${playerName}'s drawing`} />
      </div>
    );
  } else {
    const label = <span><span className="uppercase playername">{playerName}</span> guessed:</span>;
    return (
      <SketchbookGuess key={i} label={label} title={title} />
    );
  }
};

export const SketchbookReviewPage = ({ sketchbook, prev, next }) => {
  const pages = sketchbook.pages.map(getPage);
  return (
    <>
      <SketchbookTitle title={sketchbook.title} big spaced />
      <div className="sketchbook-nav">
        <button className="sketchbookReview-button" onClick={prev}>Previous</button>
        <button className="sketchbookReview-button" onClick={next}>Next</button>
      </div>
      {pages}
    </>
  )
};
