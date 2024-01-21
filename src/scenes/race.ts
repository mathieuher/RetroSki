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
    public skier?: Skier;
    private skierCameraGhost?: Actor;
    private skierPositions: SkierPositioning[] = [];
    private gates: Gate[] = [];
    private startTime?: number;
    private endTime?: number;

    // Ghost
    private globalRecordGhostPosition?: SkierPositioning[];
    private globalRecordGhost?: Actor;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.KEYBOARD_RESTART_KEY)) {
            this.returnToEventManager();
        }

        if (this.skier?.racing) {
            this.updateSkierCameraGhost();

            this.saveSkierPosition();
            this.updateGhostPosition();
        }
    }

    onActivate(_context: SceneActivationContext<{ raceConfig: EventRaceResult }>): void {
        if (_context.data?.raceConfig) {
            this.raceConfig = _context.data?.raceConfig;
            this.uiManager.buildUi(this.raceConfig.getFullTrackName());
            this.prepareRace(this.raceConfig.trackName, this.raceConfig.trackStyle, this.raceConfig.getNextSkierName()!);
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

        const missedGates = this.gates.filter(gate => !gate.passed).length
        const result = new RaceResult(this.raceConfig?.raceNumber!, this.skier?.skierName!, new Date(), timing);
        const globalResult = (this.engine as Game).trackManager.saveRecord(this.raceConfig!.trackName, new StockableRecord(result));

        if (globalResult.position === 1) {
            this.updateGlobalRecordGhost(this.raceConfig!.trackName, this.skierPositions);
        }

        this.uiManager.displayResultUi(globalResult, missedGates);
        this.uiManager.backToManagerButton.addEventListener('click', () => this.returnToEventManager(result), { once: true });
        (this.engine as Game).soundPlayer.playSound(Resources.FinishRaceSound, 0.3);
    }

    public addPenalty(): void {
        this.camera.shake(3, 3, 250);
        this.startTime! -= Config.MISSED_GATE_PENALTY_TIME;
        (this.engine as Game).soundPlayer.playSound(Resources.GateMissedSound, 0.3);
    }

    public updateSkierCameraGhost(): void {
        this.skierCameraGhost!.pos = vec(0, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE);
    }

    private saveSkierPosition(): void {
        this.skierPositions?.push(new SkierPositioning(this.skier!.pos.x, this.skier!.pos.y, this.skier!.rotation, this.skier!.getSkierCurrentAction(this.engine)));
    }

    private updateGhostPosition(): void {
        if (this.globalRecordGhost && this.globalRecordGhostPosition?.length) {
            const position = this.globalRecordGhostPosition.splice(0, 1)[0];
            if ((this.engine as Game).ghostsEnabled) {
                this.globalRecordGhost.pos = vec(position.x, position.y);
                this.globalRecordGhost.rotation = position.rotation;
                this.updateGhostGraphics(this.globalRecordGhost, position.action);
            } else {
                this.globalRecordGhost.graphics.visible = false;
            }
        }
    }

    private updateGhostGraphics(ghost: Actor, action: SkierActions): void {
        if (!ghost.graphics.visible) {
            ghost.graphics.visible = true;
        }
        const graphic = SkierGraphics.getSpriteForAction('globalRecordGhost', action);
        ghost.graphics.use(graphic.sprite);
        ghost.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private returnToEventManager(raceResult?: RaceResult): void {
        Resources.FinishRaceSound.stop();
        this.engine.goToScene('eventManager', raceResult ? { raceResult: raceResult } : {});
        this.engine.removeScene('race');
    }

    private prepareRace(trackName: string, askedTrackStyle: TrackStyles, skierName: string): void {
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
            this.globalRecordGhost.graphics.use(Resources.GlobalGhostSkier.toSprite());
            this.add(this.globalRecordGhost);
        }

        (this.engine as Game).soundPlayer.playSound(Resources.WinterSound, 0.1, true);
    }

    private cleanRace(): void {
        this.startTime = undefined;
        this.endTime = undefined;
        this.uiManager.hideUi();
        this.gates = [];
        this.raceConfig = undefined;
        this.track = undefined;
        (this.engine as Game).soundPlayer.stopSound(Resources.WinterSound);
        this.clear();
    }

    private updateGlobalRecordGhost(trackName: string, positions: SkierPositioning[]): void {
        localStorage.setItem(`ghost_${trackName}`, JSON.stringify(positions));
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