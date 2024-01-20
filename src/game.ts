import { Color, DisplayMode, Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { TrackManager } from "./utils/track-manager";
import { EventSetup } from "./scenes/event-setup";
import { EventManager } from "./scenes/event-manager";
import { SoundPlayer } from "./utils/sounds-player";
import { LogoManager } from "./utils/logo-manager";

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
        Resources.FinalPole,
        Resources.WinterSound,
        Resources.StartRaceSound,
        Resources.FinishRaceSound,
        Resources.GateMissedSound,
        Resources.PoleHittingSound
    ];

    public trackManager = new TrackManager();
    public soundPlayer = new SoundPlayer();

    constructor() {
        super({ displayMode: DisplayMode.FitContainerAndFill, width: 800, height: 800, backgroundColor: Color.White, fixedUpdateFps: 60, maxFps: 60, canvasElementId: 'game' });
    }

    initialize() {
        this.addScene('eventSetup', new EventSetup(this));
        this.addScene('eventManager', new EventManager(this));

        this.trackManager.importDefaultTracks();

        this.start(this.getLoader());

        this.goToScene('eventSetup');
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.DEBUG_KEY)) {
            if (_engine.scenes['race']?.isCurrentScene()) {
                _engine.showDebug(!_engine.isDebug);
            }
        }

        if (_engine.input.keyboard.wasPressed(Config.EXIT_KEY)) {
            this.restartGame();
        }
    }

    private getLoader(): Loader {
        const loader = new Loader(this.resourcesToLoad);
        loader.backgroundColor = "#b0d4dd";
        loader.logo = LogoManager.base64Image;
        loader.logoHeight = 250;
        loader.logoWidth = 250;
        loader.loadingBarColor = Color.fromHex("4a8291");

        loader.startButtonFactory = () => {
            let myButton = document.createElement('button');
            myButton.classList.add('start-button');
            myButton.textContent = 'Play';
            return myButton;
        };
        return loader;
    }

    private restartGame(): void {
        this.removeScene('race');
        this.goToScene('eventSetup');
    }
}

export const game = new Game();
game.initialize();