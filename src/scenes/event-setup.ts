import { Engine, Scene, SceneActivationContext } from 'excalibur';
import { EventConfig } from '../models/event-config';
import { Game } from '../game';
import { TrackStyles } from '../models/track-styles.enum';
import { Config } from '../config';

import { Subject, debounceTime, tap } from 'rxjs';

export class EventSetup extends Scene {
	private raceSetupUi = document.getElementById('event-setup')!;
	private trackInput = document.getElementById('track-input')! as HTMLInputElement;
	private trackStyleSelect = document.getElementById('track-style-select')! as HTMLInputElement;
	private skier1Input = document.getElementById('skier-1-input')! as HTMLInputElement;
	private skier2Input = document.getElementById('skier-2-input')! as HTMLInputElement;
	private racesNumberInput = document.getElementById('races-number-input')! as HTMLInputElement;
	private setupCompletedButton = document.getElementById('setup-completed-button')! as HTMLButtonElement;

	private trackNameChanged = new Subject<string>();

	constructor(engine: Engine) {
		super();
		this.engine = engine;
		this.listenSetupCompleted();
		this.listenTrackInput();
	}

	onActivate(_context: SceneActivationContext<unknown>): void {
		this.prepareRaceSetup();
	}

	onDeactivate(_context: SceneActivationContext<undefined>): void {
		this.cleanRaceSetup();
	}

	onPreUpdate(engine: Engine): void {
		if ((engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_START_BUTTON)) {
			this.completeSetup();
		}
	}

	private prepareRaceSetup(): void {
		this.loadSetup();
		this.raceSetupUi.style.display = 'flex';
		(this.engine as Game).soundPlayer.showButton();
		this.selectTrack(this.trackInput.value);
	}

	private cleanRaceSetup(): void {
		this.raceSetupUi.style.display = 'none';
	}

	private listenSetupCompleted(): void {
		this.setupCompletedButton.addEventListener('click', () => {
			this.completeSetup();
		});
	}

	private listenTrackInput(): void {
		this.trackNameChanged
			.pipe(
				debounceTime(200),
				tap(trackName => this.selectTrack(trackName)),
			)
			.subscribe();

		this.trackInput.addEventListener('input', event => {
			this.trackNameChanged.next((event.target as HTMLInputElement).value);
		});
	}

	private completeSetup(): void {
		const trackName = this.trackInput.value.toLowerCase() || Config.DEFAULT_TRACKS[0];
		const trackStyle = this.trackStyleSelect.value as TrackStyles;
		const skier1Name = this.skier1Input.value || 'Skier 1';
		const skier2Name = this.skier2Input.value || 'Skier 2';
		const numberOfRaces = +this.racesNumberInput.value || 1;

		const eventConfig = new EventConfig(
			trackName,
			(this.engine as Game).trackManager.getTrackStyle(trackName) || trackStyle,
			skier1Name,
			skier2Name !== skier1Name ? skier2Name : `${skier2Name} 2`,
			numberOfRaces,
		);
		this.persistSetup(skier1Name, skier2Name);
		this.engine.goToScene('eventManager', { eventConfig: eventConfig });
	}

	private loadSetup(): void {
		const skier1 = localStorage.getItem('setup_skier1');
		const skier2 = localStorage.getItem('setup_skier2');
		this.skier1Input.value = skier1 || '';
		this.skier2Input.value = skier2 || '';
	}

	private persistSetup(skier1: string, skier2: string) {
		localStorage.setItem('setup_skier1', skier1);
		localStorage.setItem('setup_skier2', skier2);
	}

	private selectTrack(trackName: string): void {
		const track = (this.engine as Game).trackManager.getTrackFromLocalStorage(trackName);

		if (track) {
			this.trackStyleSelect.value = track.style;
			this.trackStyleSelect.disabled = true;
		} else {
			this.trackStyleSelect.disabled = false;
		}
	}
}
