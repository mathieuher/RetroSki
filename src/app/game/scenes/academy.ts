import { Actor, type Engine, Scene, vec } from 'excalibur';
import { Skier } from '../actors/skier';
import { Config } from '../config';
import { StartingHouse } from '../actors/starting-house';
import { TouchManager } from '../utils/touch-manager';
import type { AcademyConfig } from '../models/academy-config';
import type { Game } from '../game';
import { Resources } from '../resources';
import type { Track } from '../models/track';
import { Gate } from '../actors/gate';
import { TrackBuilder } from '../utils/track-builder';
import { Decoration } from '../actors/decoration';

export class Academy extends Scene {
    public touchManager: TouchManager;
    public config: AcademyConfig;
    private skier?: Skier;
    private cameraGhost?: Actor;
    private gates: Gate[] = [];
    private startingHouse = new StartingHouse();

    constructor(engine: Game, config: AcademyConfig) {
        super();
        this.config = config;
        this.touchManager = new TouchManager(engine);
    }

    override onActivate(): void {
        if (this.config) {
            this.prepare(this.config);
        }
    }

    override onPreUpdate(engine: Engine, elapsed: number): void {
        this.updateCameraGhost();
    }

    public start(): void {
        this.skier!.startRace();
        this.startingHouse.openGate();
        (this.engine as Game).soundPlayer.playSound(Resources.StartRaceSound, 0.3);
    }

    public stop(): void {
        this.skier?.finishRace();
        (this.engine as Game).customEvents.emit({ name: 'academy-event', content: 'stopped' });
    }

    public addPenalty(): void {}

    public setSector(): void {}

    public clean(): void {
        this.clear();
    }

    private prepare(config: AcademyConfig): void {
        this.buildTrack(config.track);
        this.skier = new Skier(this.config.skierInfos, Skier.getSkierConfig(config.track.style));
        this.add(this.skier);
        this.add(this.startingHouse);

        this.setupCamera();
    }

    private setupCamera(): void {
        this.cameraGhost = new Actor({
            width: 1,
            height: 1,
            pos: vec(this.skier!.pos.x, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE)
        });
        this.camera.strategy.elasticToActor(this.cameraGhost!, 0.12, 0.2);
        this.camera.zoom = Config.CAMERA_ZOOM;
        this.add(this.cameraGhost);
    }

    private updateCameraGhost(): void {
        this.cameraGhost!.pos = vec(0, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE);
    }

    private buildTrack(track: Track): void {
        for (const stockableGate of track.gates) {
            const gate = new Gate(
                this.engine as Game,
                TrackBuilder.getGatesConfig(track.style),
                vec(stockableGate.x, stockableGate.y),
                stockableGate.width,
                stockableGate.color,
                stockableGate.gateNumber,
                stockableGate.polesAmount,
                stockableGate.pivot,
                stockableGate.vertical,
                stockableGate.isFinal,
                stockableGate.sectorNumber
            );
            this.gates.push(gate);
            this.add(gate);
        }

        if ((this.engine as Game).settingsService.getSettings().decorations && track.decorations?.length) {
            for (const stockableDecoration of track.decorations) {
                const decoration = new Decoration(
                    vec(stockableDecoration.x, stockableDecoration.y),
                    stockableDecoration.type,
                    stockableDecoration.sizeRatio
                );

                this.add(decoration);
            }
        }
    }
}
