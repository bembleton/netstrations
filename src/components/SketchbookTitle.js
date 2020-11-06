import React from 'react';

export const SketchbookTitle = ({ title }) => {
  return (
    <div className="App-section spaced">
      <div className="sketchbook-title big">
        <span>"{title}"</span>
      </div>
    </div>
  );
}