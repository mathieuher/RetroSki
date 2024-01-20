import { Engine, Scene, SceneActivationContext } from "excalibur";
import { EventConfig } from "../models/event-config";
import { Game } from "../game";
import { TrackStyles } from "../models/track-styles.enum";
import { Config } from "../config";

export class EventSetup extends Scene {

    private headerLogoUi = document.getElementById('header-logo')!;
    private raceSetupUi = document.getElementById('event-setup')!;
    private trackInput = document.getElementById('track-input')! as HTMLInputElement;
    private trackStyleSelect = document.getElementById('track-style-select')! as HTMLInputElement;
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
        this.showHeaderLogoUi();
        this.prepareRaceSetup();
    }

    onDeactivate(_context: SceneActivationContext<undefined>): void {
        this.cleanRaceSetup();
    }

    private prepareRaceSetup(): void {
        this.raceSetupUi.style.display = 'flex';
        (this.engine as Game).soundPlayer.showButton();
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
        const trackName = this.trackInput.value.toLowerCase() || Config.DEFAULT_TRACKS[0];
        const trackStyle = this.trackStyleSelect.value as TrackStyles;
        const skier1Name = this.skier1Input.value || 'Skier 1';
        const skier2Name = this.skier2Input.value || 'Skier 2';
        const numberOfRaces = +this.racesNumberInput.value || 1;

        const eventConfig = new EventConfig(trackName, trackStyle, skier1Name, skier2Name !== skier1Name ? skier2Name : `${skier2Name} 2`, numberOfRaces);
        this.engine.goToScene('eventManager', { eventConfig: eventConfig });

    }

    private showHeaderLogoUi(): void {
        this.headerLogoUi.style.display = 'inline';
    }
}