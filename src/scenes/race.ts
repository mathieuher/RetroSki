import { Actor, Engine, Scene, SceneActivationContext, Timer, vec } from "excalibur";
import { Skier } from "../actors/skier";
import { Gate } from "../actors/gate";
import { RaceUiManager } from "../utils/race-ui-manager";
import { Game } from "../game";
import { Config } from "../config";
import { StockableRecord } from "../models/stockable-record";
import { EventRaceResult } from "../models/event-race-result";
import { RaceResult } from "../models/race-result";
import { Resources } from "../resources";
import { TrackStyles } from "../models/track-styles.enum";
import { SkierConfig } from "../models/skier-config";
import { Track } from "../models/track";
import { SkierPositioning } from "../models/skier-positioning";
import { SkierActions } from "../models/skier-actions.enum";
import { SkierGraphics } from "../utils/skier-graphics";

export class Race extends Scene {

    public skier?: Skier;

    private uiManager = new RaceUiManager();
    private uiTimer = new Timer({
        interval: 50,
        repeats: true,
        fcn: () => {
            this.updateRacingUi();
        }
    });

    private raceConfig?: EventRaceResult;
    private track?: Track;
    private skierCameraGhost?: Actor;
    private skierPositions: SkierPositioning[] = [];
    private gates: Gate[] = [];
    private startTime?: number;
    private endTime?: number;
    private result?: RaceResult;

    // Ghost
    private globalRecordGhostPosition?: SkierPositioning[];
    private globalRecordGhost?: Actor;
    private eventRecordGhostPosition?: SkierPositioning[];
    private eventRecordGhost?: Actor;
    private eventRecordGhostSize?: number;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (this.skier?.racing) {
            if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_RESTART_KEY) || (_engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_EXIT_BUTTON)) {
                this.returnToEventManager();
            }

            this.updateSkierCameraGhost();
            this.saveSkierPosition();
            this.updateGhostsPosition();
        } else if (this.skier?.finish && this.result) {
            if ((_engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_START_BUTTON)) {
                this.returnToEventManager(this.result);
            }
        }
    }

    onActivate(_context: SceneActivationContext<{ eventId: string, raceConfig: EventRaceResult }>): void {
        if (_context.data?.raceConfig) {
            this.raceConfig = _context.data.raceConfig;
            this.uiManager.buildUi(this.raceConfig.getFullTrackName());
            this.prepareRace(_context.data.eventId, this.raceConfig.trackName, this.raceConfig.trackStyle, this.raceConfig.getNextSkierName()!);
        } else {
            this.returnToEventManager();
        }
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRace();
    }

    public setupCamera(): void {
        this.camera.strategy.elasticToActor(this.skierCameraGhost!, 0.12, 0.2);
        this.camera.zoom = Config.CAMERA_ZOOM;
    }

    public startRace(): void {
        this.uiManager.displayRacingUi();
        this.startTime = this.engine.clock.now();
        this.uiTimer.start();
        this.listenStopRaceEvent();
        this.skier!.startRace();
        (this.engine as Game).soundPlayer.playSound(Resources.StartRaceSound, 0.3);
    }

    public stopRace(): void {
        this.endTime = this.engine.clock.now();
        this.skier!.finishRace();
        this.uiTimer.stop();
        const timing = this.endTime - this.startTime!;

        this.globalRecordGhost?.kill();
        this.eventRecordGhost?.kill();

        const missedGates = this.gates.filter(gate => !gate.passed).length
        this.result = new RaceResult(this.raceConfig?.raceNumber!, this.skier?.skierName!, new Date(), timing);
        const globalResult = (this.engine as Game).trackManager.saveRecord(this.raceConfig!.trackName, new StockableRecord(this.result));

        if (globalResult.position === 1) {
            this.updateGlobalRecordGhost(this.raceConfig!.trackName, this.skierPositions);
        }

        if (!this.eventRecordGhostSize || this.skierPositions?.length < this.eventRecordGhostSize) {
            this.updateEventRecordGhost(this.raceConfig!.eventId, this.raceConfig!.trackName, this.skierPositions);
        }

        this.uiManager.displayResultUi(globalResult, missedGates);

        this.uiManager.backToManagerButton.addEventListener('click', () => this.returnToEventManager(this.result), { once: true });

        (this.engine as Game).soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
    }

    public addPenalty(): void {
        this.startTime! -= Config.MISSED_GATE_PENALTY_TIME;
        (this.engine as Game).soundPlayer.playSound(Resources.GateMissedSound, Config.GATE_MISSED_SOUND_VOLUME);
        this.uiManager.flashTimer(this.engine);
    }

    public updateSkierCameraGhost(): void {
        this.skierCameraGhost!.pos = vec(0, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE);
    }

    public returnToEventManager(raceResult?: RaceResult): void {
        Resources.FinishRaceSound.stop();
        this.engine.goToScene('eventManager', raceResult ? { raceResult: raceResult } : {});
        this.engine.removeScene('race');
    }

    private saveSkierPosition(): void {
        this.skierPositions?.push(new SkierPositioning(this.skier!.pos.x, this.skier!.pos.y, this.skier!.rotation, this.skier!.getSkierCurrentAction(this.engine)));
    }

    private updateGhostsPosition(): void {
        if (this.globalRecordGhost && this.globalRecordGhostPosition?.length) {
            this.updateGhostPosition(this.globalRecordGhost, this.globalRecordGhostPosition, 'global');
        }
        if (this.eventRecordGhost && this.eventRecordGhostPosition?.length) {
            this.updateGhostPosition(this.eventRecordGhost, this.eventRecordGhostPosition, 'event');
        }
    }

    private updateGhostPosition(ghost: Actor, positions: SkierPositioning[], type: 'global' | 'event'): void {
        const position = positions.splice(0, 1)[0];
        if ((this.engine as Game).ghostsEnabled) {
            ghost.pos = vec(position.x, position.y);
            ghost.rotation = position.rotation;
            this.updateGhostGraphics(ghost, position.action, type);
        } else {
            ghost.graphics.visible = false;
        }
    }

    private updateGhostGraphics(ghost: Actor, action: SkierActions, type: 'global' | 'event'): void {
        if (!ghost.graphics.visible) {
            ghost.graphics.visible = true;
        }
        const graphic = SkierGraphics.getSpriteForAction(type === 'global' ? 'globalRecordGhost' : 'eventRecordGhost', action);
        ghost.graphics.use(graphic.sprite);
        ghost.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private prepareRace(eventId: string, trackName: string, askedTrackStyle: TrackStyles, skierName: string): void {
        this.addTimer(this.uiTimer);
        this.track = this.buildTrack(trackName, askedTrackStyle);
        this.skier = new Skier(skierName, this.getSkierConfig(this.track.style));
        this.add(this.skier);

        this.skierCameraGhost = new Actor({ width: 1, height: 1, pos: vec(this.skier.pos.x, this.skier.pos.y + Config.FRONT_GHOST_DISTANCE) });
        this.setupCamera();
        this.add(this.skierCameraGhost);

        const globalRecordGhostPosition = localStorage.getItem(`ghost_${this.track.name}`);
        if (globalRecordGhostPosition) {
            this.globalRecordGhostPosition = JSON.parse(globalRecordGhostPosition);
            this.globalRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
            this.add(this.globalRecordGhost);
        }
        const eventRecordGhostPosition = localStorage.getItem(`ghost_${this.track.name}_${eventId}`);
        if (eventRecordGhostPosition) {
            this.eventRecordGhostPosition = JSON.parse(eventRecordGhostPosition);
            this.eventRecordGhostSize = this.eventRecordGhostPosition?.length;
            this.eventRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
            this.add(this.eventRecordGhost);
        }

        (this.engine as Game).soundPlayer.playSound(Resources.WinterSound, Config.RACE_AMBIANCE_SOUND_VOLUME, true);
    }

    private cleanRace(): void {
        this.startTime = undefined;
        this.endTime = undefined;
        this.uiManager.hideUi();
        this.gates = [];
        this.raceConfig = undefined;
        this.track = undefined;
        (this.engine as Game).soundPlayer.stopSound(Resources.WinterSound);
        (this.engine as Game).soundPlayer.stopSound(Resources.TurningSound);
        this.clear();
    }

    private updateGlobalRecordGhost(trackName: string, positions: SkierPositioning[]): void {
        localStorage.setItem(`ghost_${trackName}`, JSON.stringify(positions));
    }

    private updateEventRecordGhost(eventId: string, trackName: string, positions: SkierPositioning[]): void {
        localStorage.setItem(`ghost_${trackName}_${eventId}`, JSON.stringify(positions));
    }

    private listenStopRaceEvent(): void {
        this.gates?.find(gate => gate.isFinalGate)!.on('stoprace', () => this.stopRace())
    }

    private updateRacingUi(): void {
        this.uiManager.updateRacingUi(this.skier!.speed, this.engine.clock.now() - this.startTime!);
    }

    private buildTrack(trackName: string, trackStyle: TrackStyles): Track {
        const track = (this.engine as Game).trackManager.loadTrack(trackName, trackStyle);
        track.gates.forEach(gate => {
            this.gates?.push(gate);
            this.add(gate);
        });
        return track;
    }

    private getSkierConfig(trackStyle: TrackStyles): SkierConfig {
        if (trackStyle === TrackStyles.SL) {
            return Config.SL_SKIER_CONFIG;
        } else if (trackStyle === TrackStyles.GS) {
            return Config.GS_SKIER_CONFIG;
        } else if (trackStyle === TrackStyles.SG) {
            return Config.SG_SKIER_CONFIG;
        } else {
            return Config.DH_SKIER_CONFIG;
        }
    }

}