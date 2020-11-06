import React from 'react';
import { useGameContext } from '../effects/gameContext';
import { DrawPage } from './DrawPage';
import { GuessPage } from './GuessPage';
import { ReadyPage } from './ReadyPage';

export const SketchbookPage = ({ playerStatus, sketchbook, round_index }) => {
  const { gameState: { players, round_end_time } } = useGameContext();
  
  if (!sketchbook || playerStatus !== 'busy') {
    return <ReadyPage players={players} round_end_time={round_end_time} />
  }

  const page = sketchbook.pages[round_index];
  const { type, player, title, url } = page;

  if (type === 'draw') {
    return <DrawPage title={title} round_end_time={round_end_time} />;
  }
  
  if (type === 'guess') {
    return <GuessPage playerName={player.name} url={url} round_end_time={round_end_time} />;
  }
};