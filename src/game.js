import * as latinSquares from './latinSquares';
import { randomChoice } from './utils';

export const getSketchbooks = (players, topicList) => {
  
  // generate assignment matrix
  const n = players.length;
  const squares = latinSquares.generate(n);
  /* n=3
    m = [
      [0,2,1,3],
      [1,3,0,2],
      [2,1,3,0],
      [3,0,2,1]
    ]

const sketchbooks = [
  {
    title: 'Topic',
    pages: [
      { type: 'drawing', player: player, url: '' },
      { type: 'guess', player: player, title: '' },
      //...
    ]
  }
];

  */
  const sketchbooks = squares.map(sequence => {
    const title = randomChoice(topicList);
    const pages = sequence.map((playerNum, i) => (
      {
        type: (i%2) === 0 ? 'draw' : 'guess',
        player: players[playerNum]
      }
    ));
    pages[0].title = title;
    return { title, pages };
  });

  console.log('[Sketchbooks] ', sketchbooks);
  return sketchbooks;
};

