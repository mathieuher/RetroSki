import { Actor, type Engine, Scene, vec } from 'excalibur';
import { Skier } from '../actors/skier';
import { Config } from '../config';
import { StartingHouse } from '../actors/starting-house';
import { TouchManager } from '../utils/touch-manager';
import type { AcademyConfig } from '../models/academy-config';
import type { Game } from '../game';
import { Resources } from '../resources';

export class Academy extends Scene {
    public touchManager: TouchManager;
    public config: AcademyConfig;
    private skier?: Skier;
    private cameraGhost?: Actor;
    private startingHouse = new StartingHouse();

    constructor(engine: Engine, config: AcademyConfig) {
        super();
        this.config = config;
        this.touchManager = new TouchManager(engine);
    }

    override onActivate(): void {
        if (this.config) {
            this.prepare();
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

    public stop(): void {}

    public clean(): void {
        this.clear();
    }

    private prepare(): void {
        this.skier = new Skier(this.config.skierInfos, Config.GS_SKIER_CONFIG);
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
}
