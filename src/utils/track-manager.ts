import { StockableRecord } from "../models/stockable-record";
import { StockableTrack } from "../models/stockable-track";
import { Track } from "../models/track";
import { TrackBuilder } from "./track-builder";
import { format } from 'date-fns';

export class TrackManager {
    private tracks: StockableTrack[] = [];

    constructor() {
        this.loadTracksFromLocalStorage(['davos']);
    }

    public loadTrack(name: string): Track {
        const requestedTrack = this.tracks.find(track => track.name === name);
        if (requestedTrack) { return requestedTrack.toTrack() };

        const newTrack = TrackBuilder.designTrack(name);
        const stockableTrack = newTrack.toStockable();
        this.tracks.push(stockableTrack);
        this.saveTrackToLocalStorage(stockableTrack);
        return newTrack;
    }

    public saveRecord(trackName: string, record: StockableRecord): number {
        this.tracks = this.tracks.map(track => {
            if (track.name === trackName) {
                track.records.push(record);
                track.records.sort((r1, r2) => r1.timing - r2.timing);
                track.records = track.records.filter((record, index) => index < 30);
            }
            this.saveTrackToLocalStorage(track);
            return track;
        });
        this.displayCurrentRecords(trackName);
        return this.tracks.find(track => track.name === trackName)!.records.filter(r => r.timing < record.timing).length + 1;
    }

    public getRecordPosition(trackName: string, timing: number): number {
        return this.tracks.find(track => track.name === trackName)!.records.findIndex(record => record.timing === timing) + 1;
    }

    public getRecord(trackName: string): number | null {
        const records = this.getRecords(trackName);
        return records.length ? records[0].timing : null;
    }

    public getRecords(trackName: string): StockableRecord[] {
        return this.tracks.find(track => track.name === trackName)?.records || [];
    }

    public loadTracksFromLocalStorage(tracks: string[]): void {
        tracks.forEach(track => {
            let item = localStorage.getItem('track_' + track);
            if (item) {
                this.tracks.push(Object.assign(new StockableTrack(), JSON.parse(item)));
            }
        });
    }

    public saveTrackToLocalStorage(track: StockableTrack): void {
        localStorage.setItem(`track_${track.name}`, JSON.stringify(track));
    }

    private displayCurrentRecords(trackName: string) {
        const records = this.tracks.find(track => track.name === trackName)?.records;
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