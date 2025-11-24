import {
    Actor,
    type Engine,
    randomIntInRange,
    Scene,
    type SceneActivationContext,
    Timer,
    vec,
    Vector
} from 'excalibur';
import { Skier } from '../actors/skier';
import { Gate } from '../actors/gate';
import type { Game } from '../game';
import { Config } from '../config';
import { RaceResult } from '../models/race-result';
import { Resources } from '../resources';
import type { Track } from '../models/track';
import { SkierPositioning } from '../models/skier-positioning';
import type { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';
import { StockableGhost } from '../models/stockable-ghost';
import { TimedSector } from '../models/timed-sector';
import { StartingHouse } from '../actors/starting-house';
import { TouchManager } from '../utils/touch-manager';
import { SpectatorGroup } from '../actors/spectator-group';
import { RaceUiManager } from '../utils/race-ui-manager';
import type { RaceConfig } from '../models/race-config';
import { TrackBuilder } from '../utils/track-builder';
import { Decoration } from '../actors/decoration';
import { Section } from '../actors/section';

export class Race extends Scene {
    public config: RaceConfig;
    public skier?: Skier;
    public touchManager: TouchManager;

    private uiManager = new RaceUiManager();
    private uiTimer = new Timer({
        interval: 120,
        repeats: true,
        fcn: () => {
            this.updateRacingUi();
        }
    });

    private skierCameraGhost?: Actor;
    private skierPositions: SkierPositioning[] = [];
    private gates: Gate[] = [];
    private sections: Section[] = [];
    private startingHouse?: StartingHouse;
    private startTime?: number;
    private endTime?: number;
    private timedSectors: TimedSector[] = [];

    // Ghost
    private globalRecordGhostDatas?: StockableGhost;
    private globalRecordGhost?: Actor;
    private eventRecordGhostDatas?: StockableGhost;
    private eventRecordGhost?: Actor;

    private ghostIndex = 0;

    constructor(engine: Engine, config: RaceConfig) {
        super();
        this.engine = engine;
        this.config = config;
        this.touchManager = new TouchManager(engine);
    }

    override onPreUpdate(_engine: Engine, _delta: number): void {
        if (this.skier?.racing) {
            this.updateSkierCameraGhost();
            this.saveSkierPosition();
            this.updateGhostsPosition();
        }
    }

    override onActivate(): void {
        if (this.config) {
            this.prepareRace(this.config);
        }
    }

    override onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.clean();
    }

    public setupCamera(): void {
        this.camera.strategy.elasticToActor(this.skierCameraGhost!, 0.12, 0.2);
        this.camera.zoom = Config.CAMERA_ZOOM;
    }

    public start(): void {
        this.uiManager.hideGhostsUi();
        this.uiManager.displayRacingUi();
        this.startTime = this.engine.clock.now();
        this.uiTimer.start();
        this.listenStopRaceEvent();
        this.skier!.startRace();
        (this.engine as Game).soundPlayer.playSound(Resources.StartRaceSound, 0.3);
        this.startingHouse?.openGate();
    }

    public stop(): void {
        this.endTime = this.engine.clock.now();
        this.skier!.finishRace();
        this.uiTimer.stop();
        const timing = this.endTime - this.startTime!;

        this.globalRecordGhost?.kill();
        this.eventRecordGhost?.kill();

        const missedGates = this.gates.filter(gate => gate.missed).length;
        const ghost = new StockableGhost(
            this.config.track.id!,
            new Date(),
            this.config.eventId,
            this.config.skierInfos.name,
            timing,
            this.timedSectors,
            this.skierPositions
        );
        const ck = this.skierPositions.length / ((timing - missedGates * Config.MISSED_GATE_PENALTY_TIME) / 1000);
        const result = new RaceResult(this.config.skierInfos.name, new Date(), timing, missedGates, ghost, ck);
        (this.engine as Game).raceStopped.emit(result);
        (this.engine as Game).soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
    }

    public clean(): void {
        this.startTime = undefined;
        this.endTime = undefined;
        this.uiManager.hideUi();
        this.gates = [];
        (this.engine as Game).soundPlayer.stopSound(Resources.WinterSound);
        (this.engine as Game).soundPlayer.stopSound(Resources.TurningSound);
        Resources.FinishRaceSound.stop();
        this.killActors();
        this.clear();
    }

    public addPenalty(): void {
        this.startTime! -= Config.MISSED_GATE_PENALTY_TIME;
        (this.engine as Game).soundPlayer.playSound(Resources.GateMissedSound, Config.GATE_MISSED_SOUND_VOLUME);
        this.uiManager.flashTimer(this.engine);
    }

    public setSector(sectorNumber: number): void {
        const timeSector = new TimedSector(sectorNumber, this.engine.clock.now() - this.startTime!);
        this.timedSectors.push(timeSector);
        this.displaySectorDifference(timeSector);
    }

    public updateSkierCameraGhost(): void {
        this.skierCameraGhost!.pos = vec(0, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE);
    }

    public getSection(position: Vector): Section | null {
        return this.sections.find(s => s.pos.y >= position.y && s.pos.y - s.height <= position.y) || null;
    }

    private displaySectorDifference(timedSector: TimedSector): void {
        const skierSectorTime = timedSector.time;
        const globalRecordSectorTime = this.globalRecordGhostDatas?.getSectorTime(timedSector.sectorNumber);
        const eventRecordSectorTime = this.eventRecordGhostDatas?.getSectorTime(timedSector.sectorNumber);
        if (globalRecordSectorTime || eventRecordSectorTime) {
            this.uiManager.displayGhostSectorTiming(
                this.engine,
                skierSectorTime,
                globalRecordSectorTime,
                eventRecordSectorTime
            );
        }
    }

    private saveSkierPosition(): void {
        this.skierPositions?.push(
            new SkierPositioning(
                this.skier!.pos.x,
                this.skier!.pos.y,
                this.skier!.rotation,
                this.skier!.getSkierCurrentAction()
            )
        );
    }

    private updateGhostsPosition(): void {
        if (this.ghostIndex % Config.THROTTLING_GHOST === 0) {
            if (
                this.globalRecordGhost &&
                this.globalRecordGhostDatas?.positions?.length &&
                this.globalRecordGhostDatas.positions.length > this.ghostIndex
            ) {
                this.updateGhostPosition(
                    this.globalRecordGhost,
                    this.globalRecordGhostDatas.positions,
                    'global',
                    this.ghostIndex
                );
            }
            if (
                this.eventRecordGhost &&
                this.eventRecordGhostDatas?.positions?.length &&
                this.eventRecordGhostDatas.positions.length > this.ghostIndex
            ) {
                this.updateGhostPosition(
                    this.eventRecordGhost,
                    this.eventRecordGhostDatas.positions,
                    'event',
                    this.ghostIndex
                );
            }
        }
        this.ghostIndex++;
    }

    private updateGhostPosition(
        ghost: Actor,
        positions: SkierPositioning[],
        type: 'global' | 'event',
        ghostIndex: number
    ): void {
        if ((this.engine as Game).settingsService.getSettings().ghosts) {
            const position = positions[ghostIndex];
            ghost.pos = vec(position.x, position.y);
            ghost.rotation = position.rotation;
            this.updateGhostGraphics(ghost, position.action, type);
            this.updateGhostOpacity(ghost);
        } else {
            ghost.graphics.isVisible = false;
        }
    }

    private updateGhostGraphics(ghost: Actor, action: SkierActions, type: 'global' | 'event'): void {
        if (!ghost.graphics.isVisible) {
            ghost.graphics.isVisible = true;
        }
        const graphic = SkierGraphics.getSpriteForAction(
            type === 'global' ? 'globalRecordGhost' : 'eventRecordGhost',
            action
        );
        ghost.graphics.use(graphic.sprite);
        ghost.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private updateGhostOpacity(ghost: Actor) {
        if (this.skier) {
            const distance = ghost.pos.distance(this.skier.pos);
            ghost.graphics.opacity = Math.min(1, distance * 0.01);
        }
    }

    private prepareRace(raceConfig: RaceConfig): void {
        this.addTimer(this.uiTimer);
        this.buildTrack(raceConfig.track);
        this.skier = new Skier(raceConfig.skierInfos, Skier.getSkierConfig(raceConfig.track.style));
        this.add(this.skier);
        this.startingHouse = new StartingHouse();
        this.add(this.startingHouse);
        this.buildGhosts(raceConfig.globalGhost, raceConfig.eventGhost);

        if ((this.engine as Game).settingsService.getSettings().spectators) {
            this.buildSpectatorGroups(this.gates);
        }

        this.skierCameraGhost = new Actor({
            width: 1,
            height: 1,
            pos: vec(this.skier.pos.x, this.skier.pos.y + Config.FRONT_GHOST_DISTANCE)
        });
        this.setupCamera();
        this.add(this.skierCameraGhost);

        this.uiManager.displayGhostsTiming(
            this.globalRecordGhostDatas?.totalTime,
            this.eventRecordGhostDatas?.totalTime
        );

        (this.engine as Game).soundPlayer.playSound(Resources.WinterSound, Config.RACE_AMBIANCE_SOUND_VOLUME, true);
    }

    private killActors(): void {
        for (const actor of this.actors) {
            actor.kill();
        }
    }

    private buildGhosts(globalGhost?: StockableGhost, eventGhost?: StockableGhost): void {
        if (globalGhost) {
            this.globalRecordGhostDatas = StockableGhost.duplicate(globalGhost);
            this.globalRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
            this.add(this.globalRecordGhost);
        }

        if (eventGhost) {
            this.eventRecordGhostDatas = StockableGhost.duplicate(eventGhost);
            if (this.eventRecordGhostDatas?.totalTime !== this.globalRecordGhostDatas?.totalTime) {
                this.eventRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
                this.add(this.eventRecordGhost);
            }
        }
    }

    private buildSpectatorGroups(gates: Gate[]): void {
        for (const gate of gates.filter(g => !g.isFinalGate)) {
            const hasSpectatorGroup = Math.random() <= 0.2;

            if (hasSpectatorGroup) {
                const xPosition = Config.DISPLAY_WIDTH / 2;
                const left = Math.random() < 0.5;

                const group = new SpectatorGroup(
                    this.engine,
                    vec(left ? -xPosition : xPosition - Config.DISPLAY_MIN_MARGIN, gate.pos.y),
                    3 + ~~(Math.random() * Config.SPECTATORS_MAX_DENSITY),
                    left ? 'left' : 'right'
                );

                this.add(group);
            }
        }
    }

    private listenStopRaceEvent(): void {
        this.gates?.find(gate => gate.isFinalGate)!.on('stoprace', () => this.stop());
    }

    private updateRacingUi(): void {
        this.uiManager.updateRacingUi(this.skier!.speed, this.engine.clock.now() - this.startTime!);
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

        this.buildSlopeSections();
    }

    private buildSlopeSections(): void {
        // Add start section
        const startSection = new Section(
            this.engine,
            new Vector(0, Config.TRACK_START_FINISH_SECTION_LENGTH),
            Config.TRACK_START_FINISH_SECTION_LENGTH,
            0
        );
        this.add(startSection);

        const trackLength = -this.gates[this.gates.length - 1].pos.y;
        const sectionLengths = this.getSectionLengths(
            trackLength,
            Config.TRACK_SECTION_MAX_NUMBER,
            Config.TRACK_SECTION_MINMUM_LENGTH
        );

        sectionLengths.forEach((sectionLength, index) => {
            const lastSection = this.sections.at(index - 1 || 0);
            const startPosition = lastSection?.endPosition || Vector.Zero;

            const section = new Section(
                this.engine,
                startPosition,
                sectionLength,
                randomIntInRange(Config.SLOPE_MINIMUM_INCLINE, Config.SLOPE_MAXIMUM_INCLINE)
            );
            this.sections.push(section);
            this.add(section);
        });

        // Add finish section
        const endSection = new Section(
            this.engine,
            this.sections.at(this.sections.length - 1)!.endPosition,
            Config.TRACK_START_FINISH_SECTION_LENGTH,
            0
        );
        this.add(endSection);
    }

    private getSectionLengths(trackLength: number, sections: number, minimumLength: number): number[] {
        const sectionLengths: number[] = [];
        for (let index = 0; index < sections; index++) {
            const furtherSection = sections - index - 1;
            const previousSectionsLength = sectionLengths.reduce((acc, cur) => acc + cur, 0);
            const lengthAvailable = trackLength - previousSectionsLength - furtherSection * minimumLength;
            if (index + 1 === sections) {
                sectionLengths.push(lengthAvailable);
            } else {
                sectionLengths.push(Math.max(Math.random() * lengthAvailable, minimumLength));
            }
        }
        return sectionLengths;
    }
}
