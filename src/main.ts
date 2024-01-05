import { Color, Engine, Loader } from "excalibur";
import { Player } from "./player";
import { Resources } from "./resources";

class Game extends Engine {
    constructor() {
        super({ width: 800, height: 600, backgroundColor: Color.White });
    }
    initialize() {

        const player = new Player(this);
        this.add(player);

        const loader = new Loader([Resources.Skier, Resources.SkierCarving, Resources.SkierSliding]);
        this.start(loader);
    }
}

export const game = new Game();
game.initialize();