import { Actor, type Engine, Scene, vec, type Vector } from 'excalibur';
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
import { StockableGhost } from '../models/stockable-ghost';
import type { SkierPositioning } from '../models/skier-positioning';
import type { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';
import { SlopeSection } from '../actors/slope-section';

export class Academy extends Scene {
    public touchManager: TouchManager;
    public config: AcademyConfig;
    private skier?: Skier;
    private cameraGhost?: Actor;
    private gates: Gate[] = [];
    private slopeSections: SlopeSection[] = [];
    private startingHouse = new StartingHouse();
    private ghostData?: StockableGhost;
    private ghost?: Actor;
    private startTime?: number;

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
        if (this.skier?.racing && this.ghost && this.ghostData?.positions?.length) {
            this.updateGhostPosition(this.ghost, this.ghostData.positions);
        }
    }

    public start(): void {
        this.skier!.startRace();
        this.startTime = this.engine.clock.now();
        this.startingHouse.openGate();
        (this.engine as Game).soundPlayer.playSound(Resources.StartRaceSound, 0.3);
    }

    public stop(): void {
        this.skier?.finishRace();
        const timing = this.engine.clock.now() - this.startTime!;
        (this.engine as Game).customEvents.emit({ name: 'academy-event', content: 'stopped' });
        if (this.ghostData) {
            (this.engine as Game).customEvents.emit({
                name: 'result-event',
                content: timing < this.ghostData.totalTime! ? 1 : 2
            });
        }
    }

    public addPenalty(): void {}

    public setSector(): void {}

    public clean(): void {
        this.clear();
    }

    public getSectionAtPosition(position: Vector): SlopeSection | null {
        return (
            this.slopeSections.find(section => section.pos.y >= position.y && section.endPosition.y <= position.y) ||
            null
        );
    }

    private prepare(config: AcademyConfig): void {
        this.buildTrack(config.track);
        this.skier = new Skier(this.config.skierInfos, Skier.getSkierConfig(config.track.style));
        this.add(this.skier);
        this.add(this.startingHouse);

        this.buildGhost(config.eventGhost);

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
        this.buildGates(track);

        if ((this.engine as Game).settingsService.getSettings().decorations && track.decorations?.length) {
            this.buildDecorations(track);
        }

        this.buildSlopeSections(track);
    }

    private buildGates(track: Track): void {
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
    }

    private buildDecorations(track: Track): void {
        for (const stockableDecoration of track.decorations) {
            const decoration = new Decoration(
                vec(stockableDecoration.x, stockableDecoration.y),
                stockableDecoration.type,
                stockableDecoration.sizeRatio
            );

            this.add(decoration);
        }
    }

    private buildSlopeSections(track: Track): void {
        const slopeSections =
            track.slopeSections || TrackBuilder.designBasicSlopeSections(Math.abs(this.gates.at(-1)!.pos.y));
        for (const stockableSlopeSection of slopeSections) {
            const slopeSection = new SlopeSection(
                this.engine,
                vec(stockableSlopeSection.startX, stockableSlopeSection.startY),
                vec(stockableSlopeSection.endX, stockableSlopeSection.endY),
                stockableSlopeSection.incline
            );
            this.slopeSections.push(slopeSection);
            this.add(slopeSection);
        }
    }

    private buildGhost(ghost?: StockableGhost): void {
        if (ghost) {
            this.ghostData = StockableGhost.duplicate(ghost);
            this.ghost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
            this.add(this.ghost);
        }
    }

    private updateGhostPosition(ghost: Actor, positions: SkierPositioning[]): void {
        const position = positions.splice(0, 1)[0];
        ghost.pos = vec(position.x, position.y);
        ghost.rotation = position.rotation;
        this.updateGhostGraphics(ghost, position.action);
        this.updateGhostOpacity(ghost);
    }

    private updateGhostGraphics(ghost: Actor, action: SkierActions): void {
        const graphic = SkierGraphics.getSpriteForAction('globalRecordGhost', action);
        ghost.graphics.use(graphic.sprite);
        ghost.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private updateGhostOpacity(ghost: Actor) {
        if (this.skier) {
            const distance = ghost.pos.distance(this.skier.pos);
            ghost.graphics.opacity = Math.min(1, distance * 0.01);
        }
    }
}
