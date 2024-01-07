import { Engine, Scene, SceneActivationContext, Timer } from "excalibur";
import { Skier } from "../actors/skier";
import { Gate } from "../actors/gate";
import { UiManager } from "../utils/ui-manager";
import { Game } from "../game";
import { Config } from "../config";
import { StockableRecord } from "../models/stockable-record";

export class Race extends Scene {

    private uiManager = new UiManager();
    private uiTimer = new Timer({
        interval: 10,
        repeats: true,
        fcn: () => this.updateUi()
    });

    private skier?: Skier;
    private gates?: Gate[];
    private startTime?: number;
    private endTime?: number;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
    }

    onActivate(_context: SceneActivationContext<{ test: string }>): void {
        console.log('activate scene ', _context.data);
        this.prepareRace(Config.DEFAULT_TRACK_NAME);
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRace();
    }

    public stopRace(): void {
        this.endTime = this.engine.clock.now();
        this.skier!.racing = false;
        this.uiTimer.stop();
        const timing = this.endTime - this.startTime!;

        const position = (this.engine as Game).trackManager.saveRecord(Config.DEFAULT_TRACK_NAME, new StockableRecord('mathieu', new Date(), timing));
        this.uiManager.updateUiState('result');
        this.uiManager.updateUi(this.skier?.speed || 0, timing, position);

    }

    public addPenalty(gateNumber?: number): void {
        console.warn('Missed the gate n°', gateNumber, ' (+ 2s.)');
        this.camera.shake(5, 5, 500);
        this.startTime! -= 2000;
    }

    private prepareRace(trackName: string): void {
        this.skier = new Skier();
        this.add(this.skier);

        this.buildTrack(trackName);

        this.addTimer(this.uiTimer);
        this.uiTimer.start();
        this.listenStopRaceEvent();
    }

    private cleanRace(): void {
        this.startTime = undefined;
        this.endTime = undefined;
        this.uiManager.updateUiState('menu');
        this.gates = [];
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
        this.uiManager.updateUi(this.skier!.speed, (this.endTime || this.engine.clock.now()) - this.startTime);
    }

    private buildTrack(trackName: string): void {
        (this.engine as Game).trackManager.loadTrack(trackName).gates.forEach(gate => {
            this.gates?.push(gate);
            this.add(gate);
        });
    }

}