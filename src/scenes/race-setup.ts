import { Engine, Scene, SceneActivationContext } from "excalibur";

export class RaceSetup extends Scene {

    private raceSetupUi = document.getElementById('race-setup')!;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
    }

    onActivate(_context: SceneActivationContext<unknown>): void {
        this.prepareRaceSetup();
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRaceSetup();
    }

    private prepareRaceSetup(): void {
        this.raceSetupUi.style.display = 'flex';
    }

    private cleanRaceSetup(): void {
        this.raceSetupUi.style.display = 'none';
    }
}