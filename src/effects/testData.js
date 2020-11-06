export const debug = false;

const game_mode = 'review'; // lobby|game|review
const round_index = 1;
const isBusy = true;
const drawTime = 0;

const testPlayers = [
  { 
    connectionId: 1, 
    isHost: true, 
    status: isBusy ? 'busy' : 'waiting',
    name: 'joe', 
    avatar_url: 'http://placekitten.com/g/54/72' 
  },
  {
    connectionId: 2,
    status: 'busy',
    name: 'bob ross',
    avatar_url: 'http://placekitten.com/g/54/72'
  },
  { connectionId: 3, status: 'busy', name: 'link the cat', avatar_url: 'http://placekitten.com/g/54/72' },
  { connectionId: 4, status: 'busy', name: 'asdf qw', avatar_url: 'http://placekitten.com/g/54/72' },
];

const all_sketchbooks = [
  {
    title: 'Topic 1',
    pages: [
      {
        type: 'draw',
        player: testPlayers[0],
        url: 'http://placekitten.com/g/240/320',
        title: 'Topic 1'
      },
      {
        type: 'guess',
        player: testPlayers[1],
        url: 'http://placekitten.com/g/240/320',
        title: 'Foo Bar'
      },
      {
        type: 'draw',
        player: testPlayers[2],
        url: 'http://placekitten.com/g/240/320',
        title: 'Foo Bar'
      },
      {
        type: 'guess',
        player: testPlayers[3],
        url: 'http://placekitten.com/g/240/320',
        title: 'Moo Cow'
      }
    ]
  },
  {
    title: 'Topic 2',
    pages: [
      {
        type: 'draw',
        player: testPlayers[2],
        url: 'http://placekitten.com/g/241/320',
        title: 'Topic 2'
      },
      {
        type: 'guess',
        player: testPlayers[0],
        url: 'http://placekitten.com/g/240/321',
        title: 'Foo Bar'
      },
      {
        type: 'draw',
        player: testPlayers[3],
        url: 'http://placekitten.com/g/242/320',
        title: 'Foo Bar'
      },
      {
        type: 'guess',
        player: testPlayers[1],
        url: 'http://placekitten.com/g/240/322',
        title: 'Moo Cow'
      }
    ]
  }
];



export const testData = {
  playerInfo: testPlayers[0],
  players: testPlayers,
  isHost: true,
  game_mode, // lobby|game|review
  round_index,
  round_end_time: drawTime ? new Date(Date.now() + drawTime * 1000) : null,
  sketchbook: game_mode === 'game' ? all_sketchbooks[0] : null,
  next_sketchbook: null,
  all_sketchbooks: game_mode === 'review' ? all_sketchbooks : []
};
