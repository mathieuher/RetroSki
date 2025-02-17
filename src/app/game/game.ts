import { Color, DisplayMode, Engine, Loader } from 'excalibur';
import { Resources } from './resources';
import { SoundPlayer } from './utils/sounds-player';
import { LogoManager } from './utils/logo-manager';
import { Race } from './scenes/race';
import { GamepadsManager } from './utils/gamepads-manager';
import type { SettingsService } from '../common/services/settings.service';
import { Config } from './config';
import type { RaceConfig } from './models/race-config';
import type { RaceResult } from './models/race-result';
import type { RideConfig } from './models/ride-config';
import { Academy } from './scenes/academy';
import { EventEmitter } from '@angular/core';
import type { SkierIntentions } from './actors/skier';

export type GameMode = 'academy' | 'career' | 'race';
export type GateEvent = 'passed' | 'missed';
export type AcademyEvent = 'stopped';
export interface CustomGameEvent {
    name: string;
    content: SkierIntentions | GateEvent | AcademyEvent;
}
export class Game extends Engine {
    public settingsService: SettingsService;
    public soundPlayer: SoundPlayer;
    public gamepadsManager = new GamepadsManager(this);
    public raceStopped = new EventEmitter<RaceResult | undefined>();
    public customEvents = new EventEmitter<CustomGameEvent>();
    public paused = false;
    public mode: GameMode;

    private rideConfig: RideConfig;
    private resourcesToLoad = Object.values(Resources);

    constructor(mode: GameMode, rideConfig: RideConfig, settingsService: SettingsService) {
        super({
            displayMode: DisplayMode.FitContainerAndFill,
            width: 800,
            height: 800,
            backgroundColor: Color.White,
            fixedUpdateFps: 60,
            maxFps: 60,
            canvasElementId: 'game',
            suppressConsoleBootMessage: true,
            antialiasing: true,
            suppressHiDPIScaling: true
        });

        this.mode = mode;
        this.rideConfig = rideConfig;
        this.settingsService = settingsService;
        this.soundPlayer = new SoundPlayer(settingsService);
    }

    initialize() {
        if (this.mode === 'race') {
            this.addScene('race', new Race(this, this.rideConfig as RaceConfig));
            this.start(this.getLoader()).then(() => {
                this.goToScene('race');
            });
        } else if (this.mode === 'academy') {
            this.addScene('academy', new Academy(this, this.rideConfig));
            this.start(this.getLoader()).then(() => {
                this.goToScene('academy');
                this.paused = true;
            });
        }
    }

    override onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_DEBUG_KEY)) {
            _engine.showDebug(!_engine.isDebug);
        }

        if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_EXIT_KEY)) {
            this.raceStopped.emit();
        }

        if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_GHOST_KEY)) {
            this.settingsService.setGhosts(!this.settingsService.getSettings().ghosts);
        }
    }

    public stopProperly(): void {
        this.stop();
        (this.currentScene as Race).clean();
    }

    private getLoader(): Loader {
        const loader = new Loader(this.resourcesToLoad);
        loader.backgroundColor = 'white';
        loader.logo = LogoManager.base64Image;
        loader.logoHeight = 250;
        loader.logoWidth = 250;
        loader.loadingBarColor = Color.fromHex('#22165f');
        loader.suppressPlayButton = true;
        return loader;
    }
}
