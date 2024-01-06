import { Engine, Scene, SceneActivationContext, Timer } from "excalibur";
import { Skier } from "../actors/skier";
import { Gate } from "../actors/gate";
import { TrackBuilder } from "../utils/track-builder";
import { UiManager } from "../utils/ui-manager";

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

    onActivate(_context: SceneActivationContext<unknown>): void {
        this.prepareRace();
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRace();
    }

    public stopRace(): void {
        this.endTime = this.engine.clock.now();
        this.skier!.racing = false;
    }

    private prepareRace(): void {
        this.skier = new Skier();
        this.add(this.skier);

        this.buildTrack();

        this.addTimer(this.uiTimer);
        this.uiTimer.start();
        this.listenStopRaceEvent();
    }

    private cleanRace(): void {
        this.clear();
    }

    private listenStopRaceEvent(): void {
        this.gates?.find(gate => gate.isFinalGate)!.on('stoprace', () => this.stopRace())
    }

    private updateUi(): void {
        if (!this.uiManager.isDisplayed()) {
            this.uiManager.displayUi();
        }

        this.startTime = this.startTime || this.engine.clock.now();
        this.uiManager.updateUi(this.skier!.speed, (this.endTime || this.engine.clock.now()) - this.startTime);
    }

    private buildTrack(): void {
        TrackBuilder.buildTrack().forEach(gate => {
            this.gates?.push(gate);
            this.add(gate);
        });

    }

}