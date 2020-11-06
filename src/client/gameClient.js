const { Client } = require("./websocket");

export class GameClient extends Client {
  // commands
  registerPlayer (name, avatar_url) {
    const player = {
      name,
      avatar_url
    };
    this.send('registerPlayer', player);
  }

  assignSketchbook (player, sketchbook) {
    this.sendToPlayer(player, 'assignSketchbook', sketchbook);
  }

  updateStatus (status) {
    this.broadcast('setPlayerStatus', {
      connectionId: this.connectionId,
      status
    });
  }
}