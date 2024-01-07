import { Color, DisplayMode, Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Race } from "./scenes/race";
import { TrackManager } from "./utils/track-manager";
import { RaceSetup } from "./scenes/race-setup";

export class Game extends Engine {

    private resourcesToLoad = [
        Resources.Skier,
        Resources.SkierCarving,
        Resources.SkierSliding,
        Resources.SkierBraking,
        Resources.SkierJumping,
        Resources.PoleRed,
        Resources.PoleBlue,
        Resources.PoleTouchedRed,
        Resources.PoleTouchedBlue,
        Resources.PolePassedRed,
        Resources.PolePassedBlue,
        Resources.FinalPole
    ];

    public trackManager = new TrackManager();

    constructor() {
        super({ displayMode: DisplayMode.FitContainer, backgroundColor: Color.White, fixedUpdateFps: 60, maxFps: 60, canvasElementId: 'game' });
    }

    initialize() {
        this.addScene('raceSetup', new RaceSetup(this));
        this.addScene('race', new Race(this));
        const loader = new Loader(this.resourcesToLoad);
        this.start(loader);

        this.goToScene('raceSetup');
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.DEBUG_KEY)) {
            _engine.showDebug(!_engine.isDebug);
        }

        if (_engine.input.keyboard.wasPressed(Config.RESTART_KEY)) {
            this.goToScene('race');
        }
    }
}

export const game = new Game();
game.initialize();