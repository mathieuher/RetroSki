import { Actor, Engine, Scene, SceneActivationContext, Timer, vec } from 'excalibur';
import { Skier } from '../actors/skier';
import { Gate } from '../actors/gate';
import { RaceUiManager } from '../utils/race-ui-manager';
import { Game } from '../game';
import { Config } from '../config';
import { StockableRecord } from '../models/stockable-record';
import { EventRaceResult } from '../models/event-race-result';
import { RaceResult } from '../models/race-result';
import { Resources } from '../resources';
import { TrackStyles } from '../models/track-styles.enum';
import { SkierConfig } from '../models/skier-config';
import { Track } from '../models/track';
import { SkierPositioning } from '../models/skier-positioning';
import { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';
import { StockableGhost } from '../models/stockable-ghost';
import { TimedSector } from '../models/timed-sector';
import { StartingHouse } from '../actors/starting-house';
import { TouchManager } from '../utils/touch-manager';
import { StorageManager } from '../utils/storage-manager';

export class Race extends Scene {
	public skier?: Skier;
	public touchManager: TouchManager;

	private uiManager = new RaceUiManager();
	private uiTimer = new Timer({
		interval: 60,
		repeats: true,
		fcn: () => {
			this.updateRacingUi();
		},
	});

	private raceConfig?: EventRaceResult;
	private track?: Track;
	private skierCameraGhost?: Actor;
	private skierPositions: SkierPositioning[] = [];
	private gates: Gate[] = [];
	private startingHouse?: StartingHouse;
	private startTime?: number;
	private endTime?: number;
	private timedSectors: TimedSector[] = [];
	private result?: RaceResult;

	// Ghost
	private globalRecordGhostDatas?: StockableGhost;
	private globalRecordGhost?: Actor;
	private eventRecordGhostDatas?: StockableGhost;
	private eventRecordGhost?: Actor;

	constructor(engine: Engine) {
		super();
		this.engine = engine;
		this.touchManager = new TouchManager(engine);

		this.listenBackToEventManagerClicked();
	}

	onPreUpdate(_engine: Engine, _delta: number): void {
		if (this.skier?.racing) {
			if (
				_engine.input.keyboard.wasPressed(Config.KEYBOARD_RESTART_KEY) ||
				(_engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_EXIT_BUTTON)
			) {
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

	onActivate(_context: SceneActivationContext<{ eventId: string; raceConfig: EventRaceResult }>): void {
		if (_context.data?.raceConfig) {
			this.raceConfig = _context.data.raceConfig;
			this.uiManager.buildUi(this.raceConfig.getFullTrackName());
			this.prepareRace(
				this.raceConfig.trackName,
				this.raceConfig.trackStyle,
				this.raceConfig.getNextSkierName()!,
			);
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
		this.uiManager.hideGhostsUi();
		this.uiManager.displayRacingUi();
		this.startTime = this.engine.clock.now();
		this.uiTimer.start();
		this.listenStopRaceEvent();
		this.skier!.startRace();
		(this.engine as Game).soundPlayer.playSound(Resources.StartRaceSound, 0.3);
		this.startingHouse?.openGate();
	}

	public stopRace(): void {
		this.endTime = this.engine.clock.now();
		this.skier!.finishRace();
		this.uiTimer.stop();
		const timing = this.endTime - this.startTime!;

		this.globalRecordGhost?.kill();
		this.eventRecordGhost?.kill();

		const missedGates = this.gates.filter(gate => !gate.passed).length;
		this.result = new RaceResult(
			this.raceConfig?.raceNumber!,
			this.skier?.skierName!,
			new Date(),
			timing,
		);
		const globalResult = (this.engine as Game).trackManager.saveRecord(
			this.raceConfig!.trackName,
			new StockableRecord(this.result),
		);

		if (globalResult?.position === 1) {
			const eventRecordGhostDatas = new StockableGhost(
				new Date(),
				this.raceConfig!.eventId,
				this.raceConfig!.trackName,
				this.track!.builderVersion,
				this.raceConfig!.trackStyle,
				this.skier!.skierName,
				timing,
				this.timedSectors,
				this.skierPositions,
			);
			this.updateGlobalRecordGhost(eventRecordGhostDatas);
		}

		if (!this.eventRecordGhostDatas || timing < this.eventRecordGhostDatas.totalTime!) {
			const eventRecordGhostDatas = new StockableGhost(
				new Date(),
				this.raceConfig!.eventId,
				this.raceConfig!.trackName,
				this.track!.builderVersion,
				this.raceConfig!.trackStyle,
				this.skier!.skierName,
				timing,
				this.timedSectors,
				this.skierPositions,
			);
			this.updateEventRecordGhost(eventRecordGhostDatas);
		}

		if (globalResult) {
			this.uiManager.displayResultUi(globalResult, missedGates);
		}

		this.uiManager.backToManagerButton.addEventListener(
			'click',
			() => this.returnToEventManager(this.result),
			{ once: true },
		);

		(this.engine as Game).soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
	}

	public addPenalty(): void {
		this.startTime! -= Config.MISSED_GATE_PENALTY_TIME;
		(this.engine as Game).soundPlayer.playSound(
			Resources.GateMissedSound,
			Config.GATE_MISSED_SOUND_VOLUME,
		);
		this.uiManager.flashTimer(this.engine);
	}

	public setSector(sectorNumber: number): void {
		const timeSector = new TimedSector(sectorNumber, this.engine.clock.now() - this.startTime!);
		this.timedSectors.push(timeSector);
		this.displaySectorDifference(timeSector);
	}

	public updateSkierCameraGhost(): void {
		this.skierCameraGhost!.pos = vec(0, this.skier!.pos.y + Config.FRONT_GHOST_DISTANCE);
	}

	public returnToEventManager(raceResult?: RaceResult): void {
		Resources.FinishRaceSound.stop();
		this.engine.goToScene('eventManager', raceResult ? { raceResult: raceResult } : {});
		this.engine.removeScene('race');
	}

	private listenBackToEventManagerClicked(): void {
		this.uiManager.backToEventButton.addEventListener('click', () => this.returnToEventManager(), {
			once: true,
		});
	}

	private displaySectorDifference(timedSector: TimedSector): void {
		const skierSectorTime = timedSector.time;
		const globalRecordSectorTime = this.globalRecordGhostDatas?.getSectorTime(timedSector.sectorNumber);
		const eventRecordSectorTime = this.eventRecordGhostDatas?.getSectorTime(timedSector.sectorNumber);
		if (globalRecordSectorTime || eventRecordSectorTime) {
			this.uiManager.displayGhostSectorTiming(
				this.engine,
				skierSectorTime,
				globalRecordSectorTime,
				eventRecordSectorTime,
			);
		}
	}

	private saveSkierPosition(): void {
		this.skierPositions?.push(
			new SkierPositioning(
				this.skier!.pos.x,
				this.skier!.pos.y,
				this.skier!.rotation,
				this.skier!.getSkierCurrentAction(this.engine),
			),
		);
	}

	private updateGhostsPosition(): void {
		if (this.globalRecordGhost && this.globalRecordGhostDatas?.positions?.length) {
			this.updateGhostPosition(this.globalRecordGhost, this.globalRecordGhostDatas.positions, 'global');
		}
		if (this.eventRecordGhost && this.eventRecordGhostDatas?.positions?.length) {
			this.updateGhostPosition(this.eventRecordGhost, this.eventRecordGhostDatas.positions, 'event');
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
		const graphic = SkierGraphics.getSpriteForAction(
			type === 'global' ? 'globalRecordGhost' : 'eventRecordGhost',
			action,
		);
		ghost.graphics.use(graphic.sprite);
		ghost.graphics.flipHorizontal = !!graphic.flipHorizontal;
	}

	private prepareRace(trackName: string, askedTrackStyle: TrackStyles, skierName: string): void {
		this.addTimer(this.uiTimer);
		this.track = this.buildTrack(trackName, askedTrackStyle);
		this.skier = new Skier(skierName, this.getSkierConfig(this.track.style));
		this.add(this.skier);
		this.startingHouse = new StartingHouse();
		this.add(this.startingHouse);

		this.skierCameraGhost = new Actor({
			width: 1,
			height: 1,
			pos: vec(this.skier.pos.x, this.skier.pos.y + Config.FRONT_GHOST_DISTANCE),
		});
		this.setupCamera();
		this.add(this.skierCameraGhost);

		const globalRecordGhostJson = localStorage.getItem(`ghost_${this.track.name}`);
		const globalRecordGhostDatas: StockableGhost | null = globalRecordGhostJson
			? Object.assign(new StockableGhost(), JSON.parse(globalRecordGhostJson))
			: null;
		if (globalRecordGhostDatas && globalRecordGhostDatas.trackVersion === this.track.builderVersion) {
			this.globalRecordGhostDatas = globalRecordGhostDatas;
			this.globalRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
			this.add(this.globalRecordGhost);
		}
		const eventRecordGhostJson = localStorage.getItem('event_ghost');
		const eventRecordGhostDatas: StockableGhost | null = eventRecordGhostJson
			? Object.assign(new StockableGhost(), JSON.parse(eventRecordGhostJson))
			: null;
		if (eventRecordGhostDatas) {
			this.eventRecordGhostDatas = eventRecordGhostDatas;
			if (this.eventRecordGhostDatas?.totalTime !== this.globalRecordGhostDatas?.totalTime) {
				this.eventRecordGhost = new Actor({ width: 30, height: 50, pos: vec(0, 0) });
				this.add(this.eventRecordGhost);
			}
		}

		this.uiManager.displayGhostsTiming(
			this.globalRecordGhostDatas?.totalTime,
			this.eventRecordGhostDatas?.totalTime,
		);
		(this.engine as Game).soundPlayer.playSound(
			Resources.WinterSound,
			Config.RACE_AMBIANCE_SOUND_VOLUME,
			true,
		);
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

	private updateGlobalRecordGhost(ghostDatas: StockableGhost): void {
		StorageManager.save(`ghost_${ghostDatas.trackName}`, JSON.stringify(ghostDatas));
	}

	private updateEventRecordGhost(ghostDatas: StockableGhost): void {
		StorageManager.save('event_ghost', JSON.stringify(ghostDatas));
	}

	private listenStopRaceEvent(): void {
		this.gates?.find(gate => gate.isFinalGate)!.on('stoprace', () => this.stopRace());
	}

	private updateRacingUi(): void {
		this.uiManager.updateRacingUi(this.skier!.speed, this.engine.clock.now() - this.startTime!);
	}

	private buildTrack(trackName: string, trackStyle: TrackStyles): Track {
		const track = (this.engine as Game).trackManager.loadTrack(trackName, trackStyle);
		for (const gate of track.gates) {
			this.gates?.push(gate);
			this.add(gate);
		}
		return track;
	}

	private getSkierConfig(trackStyle: TrackStyles): SkierConfig {
		if (trackStyle === TrackStyles.SL) {
			return Config.SL_SKIER_CONFIG;
		}
		if (trackStyle === TrackStyles.GS) {
			return Config.GS_SKIER_CONFIG;
		}
		if (trackStyle === TrackStyles.SG) {
			return Config.SG_SKIER_CONFIG;
		}
		return Config.DH_SKIER_CONFIG;
	}
}
