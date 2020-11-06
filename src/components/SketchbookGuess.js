import React from 'react';

export const SketchbookGuess = ({ label, title }) => {
  return (
    <div className="App-section">
      {label &&
        <label>{label}</label>
      }
      <div className="sketchbook-title">
        <span>"{title}"</span>
      </div>
    </div>
  );
}