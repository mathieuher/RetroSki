import { Engine, Scene, SceneActivationContext } from 'excalibur';
import { EventConfig } from '../models/event-config';
import { RaceResult } from '../models/race-result';
import { format } from 'date-fns';
import { Config } from '../config';
import { TrackManager } from '../utils/track-manager';
import { Game } from '../game';
import { Race } from './race';

export class EventManager extends Scene {
	private eventConfig!: EventConfig;
	private trackManager!: TrackManager;

	private eventManagerUi = document.getElementById('event-manager')!;
	private skier1Label = document.getElementById('skier-1-label')!;
	private skier2Label = document.getElementById('skier-2-label')!;
	private lastResultsContainer = document.getElementById('last-results-container')!;
	private actualRankingContainer = document.getElementById('actual-ranking-container')!;
	private nextRacesContainer = document.getElementById('next-races-container')!;
	private startRaceButton = document.getElementById('start-race-button')! as HTMLButtonElement;

	constructor(engine: Engine) {
		super();
		this.engine = engine;
		this.listenAction();
	}

	onActivate(
		_context: SceneActivationContext<{ eventConfig?: EventConfig; raceResult?: RaceResult }>,
	): void {
		this.trackManager = (this.engine as Game).trackManager;
		if (_context.data?.eventConfig) {
			this.eventConfig = _context.data?.eventConfig!;
		}

		if (_context.data?.raceResult) {
			this.eventConfig.updateRaceResult(_context.data.raceResult);
		}

		this.prepareManager(this.eventConfig);
	}

	onDeactivate(_context: SceneActivationContext<undefined>): void {
		this.cleanManager();
	}

	onPreUpdate(engine: Engine): void {
		if (
			(engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_START_BUTTON) &&
			this.eventConfig?.getNextRace()
		) {
			this.startRace();
		}
	}

	public prepareManager(eventConfig: EventConfig): void {
		this.eventConfig = eventConfig;
		this.startRaceButton.innerText = this.eventConfig.getNextRace() ? 'Race' : 'Back to menu';
		this.eventManagerUi.style.display = 'flex';
		this.skier1Label.innerText = eventConfig.skier1Name;
		this.skier2Label.innerText = eventConfig.skier2Name;
		this.lastResultsContainer.innerHTML =
			this.prepareLastResultsTable(eventConfig) ||
			'<div class="placeholder">No result for the moment</div>';
		this.actualRankingContainer.innerHTML =
			this.prepareActualRankingTable(eventConfig) ||
			'<div class="placeholder">No ranking for the moment</div>';
		this.nextRacesContainer.innerHTML =
			this.prepareNextRacesTable(eventConfig) || '<div class="placeholder">No race to come</div>';
		(this.engine as Game).soundPlayer.showButton();
	}

	public cleanManager(): void {
		this.eventManagerUi.style.display = 'none';
		this.startRaceButton.removeEventListener('click', () => {});
	}

	public cleanEventRecord(): void {
		localStorage.removeItem(`ghost_${this.eventConfig.trackName}_${this.eventConfig.eventId}`);
	}

	private startRace(): void {
		(this.engine as Game).soundPlayer.hideButton();
		this.engine.addScene('race', new Race(this.engine));
		this.engine.goToScene('race', {
			eventId: this.eventConfig.eventId,
			raceConfig: this.eventConfig.getNextRace(),
		});
	}

	private prepareLastResultsTable(eventConfig: EventConfig): string {
		return eventConfig.racesResults
			.filter(raceResult => raceResult.isStarted())
			.map(raceResult => {
				const skier1RecordPosition = raceResult.skier1Timing
					? ` (${this.trackManager.getRecordPosition(
							raceResult.trackName,
							raceResult.skier1Timing,
					  )})`
					: '';
				const skier2RecordPosition = raceResult.skier2Timing
					? ` (${this.trackManager.getRecordPosition(
							raceResult.trackName,
							raceResult.skier2Timing,
					  )})`
					: '';

				return `<div class="result-line">
                <div class="number">Race ${raceResult.raceNumber}</div>
                <div>${raceResult.getFullTrackName()}</div>
                <div class="${raceResult.getWinner() === raceResult.skier1Name ? 'winner' : ''}">${
					raceResult.skier1Timing ? format(raceResult.skier1Timing, Config.FORMAT_TIMING) : ''
				}${skier1RecordPosition}</div>
                <div>${
					raceResult.isCompleted()
						? `(${format(
								Math.abs(raceResult.skier1Timing! - raceResult.skier2Timing!),
								Config.FORMAT_TIMING,
						  )})`
						: ''
				}</div>
                <div class="${raceResult.getWinner() === raceResult.skier2Name ? 'winner' : ''}">${
					raceResult.skier2Timing ? format(raceResult.skier2Timing, Config.FORMAT_TIMING) : ''
				}${skier2RecordPosition}</div>
            </div>`;
			})
			.join('');
	}

	private prepareActualRankingTable(eventConfig: EventConfig): string {
		const rankings = eventConfig.getActualRankings();
		return rankings
			.filter(ranking => ranking.time > 0)
			.map((ranking, index) => {
				return `
                <div class="result-line ${index < 1 ? 'first' : ''}">
                    <div>${index + 1}</div>
                    <div>${ranking.skierName}</div>
                    <div>${ranking.victories}</div>
                    <div>${format(ranking.time, Config.FORMAT_TIMING)}</div>
                    <div>${
						index > 0
							? `+ ${format(Math.abs(ranking.time - rankings[0].time), Config.FORMAT_TIMING)}`
							: ''
					}</div>
                </div>
            `;
			})
			.join('');
	}

	private prepareNextRacesTable(eventConfig: EventConfig): string {
		return eventConfig.racesResults
			.filter(raceResult => !raceResult.isCompleted())
			.map((raceResult, index) => {
				let trackRecord = `${this.trackManager.getRecord(eventConfig.trackName) || ''}`;
				trackRecord = trackRecord ? format(+trackRecord, Config.FORMAT_TIMING) : '';
				let result = '';
				if (!raceResult.skier1Timing) {
					result += `
                    <div class="result-line ${index < 1 ? 'next' : ''}">
                        <div class="number">Race ${raceResult.raceNumber}</div>
                        <div>${raceResult.getFullTrackName()}</div>
                        <div>${raceResult.skier1Name}</div>
                        <div>${trackRecord}</div>
                    </div>`;
				}
				if (!raceResult.skier2Timing) {
					result += `
                    <div class="result-line ${index < 1 && raceResult.skier1Timing ? 'next' : ''}">
                        <div class="number">Race ${raceResult.raceNumber}</div>
                        <div>${raceResult.getFullTrackName()}</div>
                        <div>${raceResult.skier2Name}</div>
                        <div>${trackRecord}</div>
                    </div>`;
				}
				return result;
			})
			.join('');
	}

	private backToMenu(): void {
		this.cleanEventRecord();
		this.engine.goToScene('eventSetup');
	}

	private listenAction(): void {
		this.startRaceButton.addEventListener('click', () => {
			if (this.eventConfig?.getNextRace()) {
				this.startRace();
			} else {
				this.backToMenu();
			}
		});
	}
}
