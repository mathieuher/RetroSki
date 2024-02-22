import { Color, DisplayMode, Engine, Loader } from 'excalibur';
import { Resources } from './resources';
import { Config } from './config';
import { TrackManager } from './utils/track-manager';
import { EventSetup } from './scenes/event-setup';
import { EventManager } from './scenes/event-manager';
import { SoundPlayer } from './utils/sounds-player';
import { LogoManager } from './utils/logo-manager';
import { Race } from './scenes/race';
import { GamepadsManager } from './utils/gamepads-manager';
import { WelcomeUiManager } from './utils/welcome-ui-manager';

export class Game extends Engine {
	private resourcesToLoad = [
		Resources.Skier,
		Resources.SkierCarving,
		Resources.SkierSliding,
		Resources.SkierBraking,

		Resources.GlobalGhostSkier,
		Resources.GlobalGhostSkierCarving,
		Resources.GlobalGhostSkierSliding,
		Resources.GlobalGhostSkierBraking,

		Resources.EventRecordGhost,
		Resources.EventRecordGhostCarving,
		Resources.EventRecordGhostSliding,
		Resources.EventRecordGhostBraking,

		Resources.StartingGate,
		Resources.StartingHouse,
		Resources.PoleRed,
		Resources.PoleBlue,
		Resources.PoleSlRed,
		Resources.PoleSlBlue,
		Resources.PoleCheckRed,
		Resources.PoleCheckBlue,
		Resources.FinalGate,

		Resources.Spectator1,
		Resources.Spectator2,
		Resources.Spectator3,
		Resources.Spectator4,

		Resources.WinterSound,
		Resources.StartRaceSound,
		Resources.FinishRaceSound,
		Resources.GateMissedSound,
		Resources.PoleHittingSound,
		Resources.TurningSound,
		Resources.SpectatorsSound,
		Resources.Spectators2Sound,
		Resources.Spectators3Sound,
		Resources.Spectators4Sound,
		Resources.SpectatorsIntenseSound,
		Resources.SpectatorHitSound,
		Resources.SpectatorHit2Sound,
		Resources.SpectatorHit3Sound,
		Resources.SpectatorsBellsSound,
		Resources.SpectatorsBells2Sound,
	];

	public welcomeUiManager = new WelcomeUiManager();
	public trackManager = new TrackManager();
	public soundPlayer = new SoundPlayer();
	public gamepadsManager = new GamepadsManager(this);

	public ghostsEnabled = true;

	constructor() {
		super({
			displayMode: DisplayMode.FitContainerAndFill,
			width: 800,
			height: 800,
			backgroundColor: Color.White,
			fixedUpdateFps: 60,
			maxFps: 60,
			canvasElementId: 'game',
		});
	}

	initialize() {
		this.addScene('eventSetup', new EventSetup(this));
		this.addScene('eventManager', new EventManager(this));

		this.trackManager.importDefaultTracks();
		this.trackManager.importDefaultGhosts();

		this.start(this.getLoader()).then(() => {
			this.welcomeUiManager.showWelcomeUi();
			this.goToScene('eventSetup');
		});
	}

	onPreUpdate(_engine: Engine, _delta: number): void {
		if (_engine.scenes?.race?.isCurrentScene()) {
			if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_DEBUG_KEY)) {
				_engine.showDebug(!_engine.isDebug);
			} else if (
				_engine.input.keyboard.wasPressed(Config.KEYBOARD_GHOST_KEY) ||
				this.gamepadsManager.wasButtonPressed(Config.GAMEPAD_GHOST_BUTTON)
			) {
				this.ghostsEnabled = !this.ghostsEnabled;
			}
		}

		if (
			_engine.input.keyboard.wasPressed(Config.KEYBOARD_EXIT_KEY) ||
			this.gamepadsManager.wasButtonPressed(Config.GAMEPAD_EXIT_BUTTON)
		) {
			if (_engine.scenes?.eventManager?.isCurrentScene()) {
				this.goToScene('eventSetup');
			} else if (_engine.scenes?.race?.isCurrentScene()) {
				(_engine.currentScene as Race).returnToEventManager();
			} else if (_engine.scenes?.eventSetup?.isCurrentScene()) {
				this.welcomeUiManager.showWelcomeUi();
			}
		}
	}

	private getLoader(): Loader {
		const loader = new Loader(this.resourcesToLoad);
		loader.backgroundColor = '#b0d4dd';
		loader.logo = LogoManager.base64Image;
		loader.logoHeight = 250;
		loader.logoWidth = 250;
		loader.loadingBarColor = Color.fromHex('#4a8291');
		loader.suppressPlayButton = true;
		return loader;
	}
}

export const game = new Game();
game.initialize();
