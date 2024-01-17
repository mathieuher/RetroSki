import { Actor, Engine, Scene, SceneActivationContext, Timer, vec } from "excalibur";
import { Skier } from "../actors/skier";
import { Gate } from "../actors/gate";
import { UiManager } from "../utils/ui-manager";
import { Game } from "../game";
import { Config } from "../config";
import { StockableRecord } from "../models/stockable-record";
import { EventRaceResult } from "../models/event-race-result";
import { RaceResult } from "../models/race-result";

export class Race extends Scene {

    private uiManager = new UiManager();
    private uiTimer = new Timer({
        interval: 10,
        repeats: true,
        fcn: () => this.updateUi()
    });

    private raceConfig?: EventRaceResult;
    public skier?: Skier;
    private skierGhost?: Actor;
    private gates?: Gate[];
    private startTime?: number;
    private endTime?: number;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.RESTART_KEY)) {
            this.returnToEventManager();
        }
    }

    onActivate(_context: SceneActivationContext<{ raceConfig: EventRaceResult }>): void {
        if (_context.data?.raceConfig) {
            this.raceConfig = _context.data?.raceConfig;
            this.prepareRace(this.raceConfig.trackName, this.raceConfig.getNextSkierName()!);
        } else {
            this.returnToEventManager();
        }
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRace();
    }

    public stopRace(): void {
        this.endTime = this.engine.clock.now();
        this.skier!.finishRace();
        this.uiTimer.stop();
        const timing = this.endTime - this.startTime!;

        const result = new RaceResult(this.raceConfig?.raceNumber!, this.skier?.skierName!, new Date(), timing);
        const position = (this.engine as Game).trackManager.saveRecord(this.raceConfig!.trackName, new StockableRecord(result));
        this.uiManager.updateUiState('result');
        this.uiManager.updateUi(this.skier?.speed || 0, timing, position);
        this.uiManager.backToManagerButton.addEventListener('click', () => this.returnToEventManager(result), { once: true });
    }

    public addPenalty(gateNumber?: number): void {
        console.warn('Missed the gate n°', gateNumber, ' (+ 2s.)');
        this.camera.shake(5, 5, 500);
        this.startTime! -= 3000;
    }

    public updateGhost(yPosition: number): void {
        this.skierGhost!.pos = vec(0, yPosition + Config.FRONT_GHOST_DISTANCE);
    }

    public setupCamera(): void {
        this.camera.strategy.elasticToActor(this.skierGhost!, 0.12, 0.2);
        this.camera.zoom = Config.CAMERA_ZOOM;
    }

    public startRace(): void {
        this.uiTimer.start();
        this.listenStopRaceEvent();
        this.skier!.startRace();
    }

    private returnToEventManager(raceResult?: RaceResult): void {
        this.engine.goToScene('eventManager', raceResult ? { raceResult: raceResult } : {});
        this.engine.removeScene('race');
    }

    private prepareRace(trackName: string, skierName: string): void {
        this.skier = new Skier(skierName);
        this.add(this.skier);
        this.skierGhost = new Actor({ width: 1, height: 1, pos: vec(this.skier.pos.x, this.skier.pos.y + Config.FRONT_GHOST_DISTANCE) });
        this.setupCamera();

        this.buildTrack(trackName);
        this.add(this.skierGhost);
        this.addTimer(this.uiTimer);
    }

    private cleanRace(): void {
        this.startTime = undefined;
        this.endTime = undefined;
        this.uiManager.updateUiState('menu');
        this.gates = [];
        this.raceConfig = undefined;
        this.clear();
    }

    private listenStopRaceEvent(): void {
        this.gates?.find(gate => gate.isFinalGate)!.on('stoprace', () => this.stopRace())
    }

    private updateUi(): void {
        if (this.uiManager.state === 'menu') {
            this.uiManager.updateUiState('racing');
        }

        this.startTime = this.startTime || this.engine.clock.now();
        this.uiManager.updateUi(this.skier?.speed || 0, (this.endTime || this.engine.clock.now()) - this.startTime);
    }

    private buildTrack(trackName: string): void {
        (this.engine as Game).trackManager.loadTrack(trackName).gates.forEach(gate => {
            this.gates?.push(gate);
            this.add(gate);
        });
    }

}