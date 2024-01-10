import { Engine, Scene, SceneActivationContext } from "excalibur";
import { EventConfig } from "../models/event-config";

export class EventSetup extends Scene {

    private raceSetupUi = document.getElementById('event-setup')!;
    private trackInput = document.getElementById('track-input')! as HTMLInputElement;
    private skier1Input = document.getElementById('skier-1-input')! as HTMLInputElement;
    private skier2Input = document.getElementById('skier-2-input')! as HTMLInputElement;
    private racesNumberInput = document.getElementById('races-number-input')! as HTMLInputElement;
    private setupCompletedButton = document.getElementById('setup-completed-button')! as HTMLButtonElement;

    constructor(engine: Engine) {
        super();
        this.engine = engine;
        this.listenSetupCompleted();
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

    private listenSetupCompleted(): void {
        this.setupCompletedButton.addEventListener('click', () => {
            this.completeSetup();
        });
    }

    private completeSetup(): void {
        const trackName = this.trackInput.value;
        const skier1Name = this.skier1Input.value;
        const skier2Name = this.skier2Input.value;
        const numberOfRaces = +this.racesNumberInput.value;

        if (trackName && skier1Name && skier2Name && numberOfRaces) {
            const eventConfig = new EventConfig(trackName, skier1Name, skier2Name, numberOfRaces);
            this.engine.goToScene('eventManager', { eventConfig: eventConfig });
        }

    }
}