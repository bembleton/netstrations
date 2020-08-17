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
  submitDrawing (url) {
    const netstration = {};
    this.send('submitDrawing', netstration);
  }
  submitGuess
}