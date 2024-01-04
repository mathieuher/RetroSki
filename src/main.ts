import { Engine, Loader } from "excalibur";
import { Player } from "./player";

class Game extends Engine {
  constructor() {
    super({ width: 800, height: 600 });
  }
  initialize() {

    const player = new Player(this);
    this.add(player);

    const loader = new Loader();
    this.start(loader);
  }
}

export const game = new Game();
game.initialize();