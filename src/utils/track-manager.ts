import { Config } from "../config";
import { RecordResult } from "../models/record-result";
import { StockableRecord } from "../models/stockable-record";
import { StockableTrack } from "../models/stockable-track";
import { Track } from "../models/track";
import { TrackStyles } from "../models/track-styles.enum";
import { TrackBuilder } from "./track-builder";
import { format } from 'date-fns';

export class TrackManager {
    constructor() {
    }

    public loadTrack(name: string, trackStyle: TrackStyles): Track {
        const requestedTrack = this.getTrackFromLocalStorage(name);
        if (requestedTrack) { return requestedTrack.toTrack() };

        const newTrack = TrackBuilder.designTrack(name, trackStyle);
        const stockableTrack = newTrack.toStockable();
        this.saveTrackToLocalStorage(stockableTrack);
        return newTrack;
    }

    public importDefaultTracks(): void {
        Config.DEFAULT_TRACKS.forEach(track => {
            if (!localStorage.getItem(`track_${track}`)) {
                fetch(`tracks/${track}.json`).then(res => res.json()).then(res => {
                    localStorage.setItem(`track_${track}`, JSON.stringify(res));
                });
            }
        })
    }

    public saveRecord(trackName: string, record: StockableRecord): { position: number, records: RecordResult[] } {
        const track = this.getTrackFromLocalStorage(trackName);
        if (track) {
            track.records.push(record);
            track.records.sort((r1, r2) => r1.timing - r2.timing);
            this.saveTrackToLocalStorage(track);
        }
        return { position: track!.records.filter(r => r.timing < record.timing).length + 1, records: this.getCurrentRecords(trackName) };
    }

    public getRecordPosition(trackName: string, timing: number): number {
        return this.getTrackFromLocalStorage(trackName)!.records.findIndex(record => record.timing === timing) + 1;
    }

    public getRecord(trackName: string): number | null {
        const records = this.getRecords(trackName);
        return records.length ? records[0].timing : null;
    }

    public getRecords(trackName: string): StockableRecord[] {
        return this.getTrackFromLocalStorage(trackName)?.records || [];
    }

    public saveTrackToLocalStorage(track: StockableTrack): void {
        localStorage.setItem(`track_${track.name}`, JSON.stringify(track));
    }

    private getTrackFromLocalStorage(trackName: string): StockableTrack | null {
        let item = localStorage.getItem('track_' + trackName);
        if (item) {
            const tempTrack = Object.assign(new StockableTrack(), JSON.parse(item));
            return new StockableTrack(tempTrack.name, tempTrack.style, tempTrack.date, tempTrack.gates, tempTrack.records);
        }
        return null;
    }

    private getCurrentRecords(trackName: string): RecordResult[] {
        const records = this.getTrackFromLocalStorage(trackName)!.records;
        return records?.map((record, index) => {
            const difference = record.timing - records[0].timing;
            return new RecordResult(index + 1, record.player, format(record.date, 'd MMM yyyy HH:mm'), format(record.timing, 'mm:ss:SS'), difference ? format(difference, 'ss:SS') : '');
        });
    }

}