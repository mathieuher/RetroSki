import { Color, DisplayMode, Engine, Loader, PointerScope } from 'excalibur';
import { Resources } from './resources';
import { SoundPlayer } from './utils/sounds-player';
import { LogoManager } from './utils/logo-manager';
import { Race } from './scenes/race';
import { GamepadsManager } from './utils/gamepads-manager';
import type { SettingsService } from '../common/services/settings.service';
import { Config } from './config';
import { EventEmitter } from '@angular/core';
import type { RaceConfig } from './models/race-config';
import type { RaceResult } from './models/race-result';

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
        Resources.FinalGateShadow,
        Resources.PoleShadow,
        Resources.PoleSlShadow,

        Resources.Spectator1,
        Resources.Spectator2,
        Resources.Spectator3,
        Resources.Spectator4,
        Resources.SpectatorShadow,

        Resources.Tree,
        Resources.TreeShadow,

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
        Resources.SpectatorsBells2Sound
    ];

    public raceStopped = new EventEmitter<RaceResult | undefined>();

    public settingsService: SettingsService;

    public soundPlayer: SoundPlayer;
    public gamepadsManager = new GamepadsManager(this);

    private raceConfig: RaceConfig;

    constructor(raceConfig: RaceConfig, settingsService: SettingsService) {
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
            suppressHiDPIScaling: true,
            pointerScope: PointerScope.Document
        });

        this.raceConfig = raceConfig;
        this.settingsService = settingsService;
        this.soundPlayer = new SoundPlayer(settingsService);
    }

    initialize() {
        this.addScene('race', new Race(this, this.raceConfig));

        this.start(this.getLoader()).then(() => {
            this.goToScene('race');
        });
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
        (this.currentScene as Race).cleanRace();
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
