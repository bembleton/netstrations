import { useMessage } from "./useMessage";
import { useGameContext } from "./gameContext";
//import { usePlayers } from "./usePlayers";
import { useUpdates } from "./useSanity";

  // I. host creates a game, registers
  // II. players join, register
  // III. host configures game settings
  // IV. host starts the game
  // V. host generates sketchbooks and assigns one to each player 'assignSketchbook'

  //    
  // 1. the host announces 'startRound' for round x
  // 2. each play swaps next_sketchbook and sketchbook
  //    each player sets the current_page,
  //    renders the activity,
  //    and announces a 'busy' status
  // 3. when player clicks 'send' or time expires,
  //    the player sends the updated sketchbook to the next_player as next_sketchbook,
  //    announces a 'done' status,
  //    and renders the idle screen
  // 5. host waits until all players are 'done'
  // 6. repeat steps 1-7 for remaining rounds
  // 7. host announces end_game
  // 11. display completed sketchbook
  // 12. ?? each player announces their sketchbook
  // 13. ?? players can review all sketchbooks

export const useGameClient = () => {
  const { client, gameState, updateGameState } = useGameContext();
  //const { ready: everyone_ready, players } = usePlayers();
  //const [roundTimeout, setRoundTimeout] = useState(null);
  
  const {
    game_mode,
    round_index,
    //round_end_time,
    drawTime,
    isHost,
    playerInfo,
    players,
    sketchbook,
    next_sketchbook = [],
    all_sketchbooks
  } = gameState;

  useMessage('restart', () => {
    updateGameState({
      game_mode: 'lobby',
      round_index: 0,
      sketchbook: null,
      next_sketchbook: null,
      all_sketchbooks: []
    });
  }, [gameState]);

  useMessage('assignSketchbook', (next_sketchbook) => {
    console.log('[assignSketchbook]', next_sketchbook.title);
    updateGameState({ next_sketchbook });
  }, [gameState]);

  useMessage('reviewSketchbook', (sketchbook) => {
    if (playerInfo.connectionId === sketchbook.pages[0].player.connectionId) {
      return;
    }
    all_sketchbooks.push(sketchbook);
    updateGameState({ all_sketchbooks });
  }, [gameState]);

  useMessage('setPlayerStatus', ({ connectionId, status }) => {
    const playeridx = players.findIndex(x => x.connectionId === connectionId);
    const update = {};

    if (playerInfo && connectionId === playerInfo.connectionId) {
      update.playerInfo = { ...playerInfo, status };
    }

    if (playeridx > -1) {
      const p = players[playeridx];
      const player = { ...p };
      console.log(`[setPlayerStatus] ${player.name} is now ${status}`);
      player.status = status;
      update.players = players.map(x => ({ ...x }));
      update.players[playeridx] = player;
    }

    updateGameState(update);
  }, [gameState, players]);

  // round_index: 0,

  useMessage('startRound', (roundInfo) => {
    console.log(`[startRound]`);
    const { round_index, round_end_time } = roundInfo;

    updateGameState({
      game_mode: 'game',
      round_index,
      round_end_time,
      sketchbook: next_sketchbook,
      next_sketchbook: null
    });
  }, [gameState]);

  useMessage('review', () => {
    console.log('[review]');

    updateGameState({
      game_mode: 'review',
      round_index: -1,
      sketchbook: null,
      next_sketchbook: null,
      all_sketchbooks: [next_sketchbook]
    });

    client.broadcast('reviewSketchbook', next_sketchbook);
    
  }, [gameState]);

  // update player status based on game state
  useUpdates(() => {
    const { status } = playerInfo || {};
    const next = next_sketchbook !== null;
    const curr = sketchbook !== null;
    let newStatus = null;

    if (!next && !curr) newStatus = 'waiting';
    if (curr && status !== 'busy') newStatus = 'busy';
    if (next && !curr) newStatus = 'ready';

    if (newStatus) {
      client.updateStatus(newStatus);
    }

  }, [playerInfo, sketchbook, next_sketchbook]);

  useUpdates(() => {
    if (!isHost) return;
    if (game_mode !== 'game') return;
    const everyone_ready = players && players.length > 0 && players.every(x => x.status === 'ready');
    if (!everyone_ready) return;
    
    if (round_index === players.length - 1) {
      console.log('[useGameClient] starting review');
      client.broadcast('review');
      return;
    }

    // start the next round
    console.log('[useGameClient] starting round');
    client.broadcast('startRound', {
      round_index: round_index + 1,
      round_end_time: drawTime ? new Date(Date.now() + drawTime*1000).getTime() : null
    });

  }, [drawTime, game_mode, isHost, players]);

  // useUpdates(() => {
  //   if (round_end_time === null) {
  //     clearTimeout(roundTimeout);
  //     setRoundTimeout(null);
  //     return;
  //   }
  //   const timespan = round_end_time - Date.now();
  //   const timeout = setTimeout(() => {
  //     client.broadcast('endRound');
  //   }, timespan);
  //   setRoundTimeout(timeout);
  // }, [round_end_time]);

  // useTeardown(() => {
  //   setRoundTimeout(timeout => {
  //     clearTimeout(timeout);
  //   });
  // });
};
