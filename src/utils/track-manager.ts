import { StockableRecord } from "../models/stockable-record";
import { StockableTrack } from "../models/stockable-track";
import { Track } from "../models/track";
import { TrackBuilder } from "./track-builder";
import { format } from 'date-fns';

export class TrackManager {
    constructor() {
    }

    public loadTrack(name: string): Track {
        const requestedTrack = this.getTrackFromLocalStorage(name);
        if (requestedTrack) { return requestedTrack.toTrack() };

        const newTrack = TrackBuilder.designTrack(name);
        const stockableTrack = newTrack.toStockable();
        this.saveTrackToLocalStorage(stockableTrack);
        return newTrack;
    }

    public saveRecord(trackName: string, record: StockableRecord): number {
        const track = this.getTrackFromLocalStorage(trackName);
        if (track) {
            track.records.push(record);
            track.records.sort((r1, r2) => r1.timing - r2.timing);
            this.saveTrackToLocalStorage(track);
        }
        this.displayCurrentRecords(trackName);
        return track!.records.filter(r => r.timing < record.timing).length + 1;
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
            return new StockableTrack(tempTrack.name, tempTrack.date, tempTrack.gates, tempTrack.records);
        }
        return null;
    }

    private displayCurrentRecords(trackName: string) {
        const records = this.getTrackFromLocalStorage(trackName)!.records;
        console.table(records?.map((record, index) => {
            return {
                position: index + 1,
                player: record.player,
                date: format(record.date, 'd MMM yyyy HH:mm'),
                time: format(record.timing, 'mm:ss:SS'),
                difference: format(record.timing - records[0].timing, 'ss:SS')
            };
        }));
    }

}