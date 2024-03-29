import { Config } from '../config';
import { RecordResult } from '../models/record-result';
import { StockableGhost } from '../models/stockable-ghost';
import { StockableRecord } from '../models/stockable-record';
import { StockableTrack } from '../models/stockable-track';
import { Track } from '../models/track';
import { TrackStyles } from '../models/track-styles.enum';
import { StorageManager } from './storage-manager';
import { TrackBuilder } from './track-builder';
import { format } from 'date-fns';

export class TrackManager {
	/**
	 * Load an already existing track by its name or generate a new one (if not existing or older version)
	 * @param name name of the track to load/build
	 * @param trackStyle style of the track to build (only used when building a new track)
	 * @returns the track
	 */
	public loadTrack(name: string, trackStyle: TrackStyles): Track {
		const requestedTrack = this.getTrackFromLocalStorage(name);
		if (requestedTrack?.builderVersion === Config.CURRENT_BUILDER_VERSION) {
			return requestedTrack.toTrack();
		}

		const newTrack = TrackBuilder.designTrack(name, trackStyle);
		const stockableTrack = newTrack.toStockable();
		this.saveTrackToLocalStorage(stockableTrack);
		return newTrack;
	}

	/**
	 * Import default tracks from the assets
	 * Override existing persisted track if the default track version from the assets use a more recent builder version
	 */
	public importDefaultTracks(): void {
		for (const track of Config.DEFAULT_TRACKS) {
			const serializedStoredTrack = localStorage.getItem(`track_${track}`);
			const storedTrack = serializedStoredTrack ? JSON.parse(serializedStoredTrack) : null;
			fetch(`tracks/${track}.json`)
				?.then(trackJson => trackJson.json())
				?.then((track: StockableTrack) => {
					if (
						!storedTrack?.builderVersion ||
						(track.builderVersion || 0) > storedTrack.builderVersion
					)
						this.saveTrackToLocalStorage(track);
				})
				.catch(() => console.warn('Unable to load default track from the assets : ', track));
		}
	}

	/**
	 * Import default ghosts from the assets
	 * Override existing persisted ghosts if the ghost from the asset is using a more recent track version
	 */
	public importDefaultGhosts(): void {
		for (const track of Config.DEFAULT_TRACKS) {
			const ghostPersistedJson = localStorage.getItem(`ghost_${track}`);
			const ghostPersistedData: StockableGhost = ghostPersistedJson
				? JSON.parse(ghostPersistedJson)
				: null;
			fetch(`ghosts/${track}.json`)
				?.then(ghostJson => ghostJson.json())
				?.then((defaultGhost: StockableGhost) => {
					if (
						!ghostPersistedData?.trackVersion ||
						(defaultGhost.trackVersion || 0) > ghostPersistedData.trackVersion
					) {
						StorageManager.save(`ghost_${track}`, JSON.stringify(defaultGhost));
					}
				})
				.catch(() => console.warn('Unable to load default ghost from the assets : ', track));
		}
	}

	public saveRecord(
		trackName: string,
		record: StockableRecord,
	): { position: number; records: RecordResult[] } | null {
		const track = this.getTrackFromLocalStorage(trackName);
		if (track) {
			track.records.push(record);
			track.records.sort((r1, r2) => r1.timing - r2.timing);
			this.saveTrackToLocalStorage(track);
			return {
				position: track.records.filter(r => r.timing < record.timing).length + 1,
				records: this.getCurrentRecords(trackName),
			};
		}
		return null;
	}

	public getRecordPosition(trackName: string, timing: number): number | null {
		const track = this.getTrackFromLocalStorage(trackName);
		if (track) {
			return track.records.findIndex(record => record.timing === timing) + 1;
		}
		return null;
	}

	public getRecord(trackName: string): number | null {
		const records = this.getRecords(trackName);
		return records.length ? records[0].timing : null;
	}

	public getRecords(trackName: string): StockableRecord[] {
		return this.getTrackFromLocalStorage(trackName)?.records || [];
	}

	public saveTrackToLocalStorage(track: StockableTrack): void {
		StorageManager.save(`track_${track.name.toLowerCase()}`, JSON.stringify(track));
	}

	public getTrackStyle(trackName: string): TrackStyles | undefined {
		return this.getTrackFromLocalStorage(trackName)?.style;
	}

	public getTrackFromLocalStorage(trackName: string): StockableTrack | null {
		const item = localStorage.getItem(`track_${trackName.toLowerCase()}`);
		if (item) {
			const tempTrack: StockableTrack = Object.assign(new StockableTrack(), JSON.parse(item));
			if (tempTrack.builderVersion === Config.CURRENT_BUILDER_VERSION) {
				return new StockableTrack(
					tempTrack.builderVersion,
					tempTrack.name,
					tempTrack.style,
					tempTrack.date,
					tempTrack.gates,
					tempTrack.records,
				);
			}
		}
		return null;
	}

	private getCurrentRecords(trackName: string): RecordResult[] {
		const track = this.getTrackFromLocalStorage(trackName);
		if (track) {
			const records = track.records;
			return records?.map((record, index) => {
				const difference = record.timing - records[0].timing;
				return new RecordResult(
					index + 1,
					record.player,
					format(record.date, 'd MMM yyyy HH:mm'),
					format(record.timing, 'mm:ss:SS'),
					difference ? format(difference, difference >= 60000 ? 'mm:ss:SS' : 'ss:SS') : '',
				);
			});
		}
		return [];
	}
}
