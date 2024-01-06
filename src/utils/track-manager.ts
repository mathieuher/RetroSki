import { StockableRecord } from "../models/stockable-record";
import { StockableTrack } from "../models/stockable-track";
import { Track } from "../models/track";
import { TrackBuilder } from "./track-builder";

export class TrackManager {
    private tracks: StockableTrack[] = [];

    public loadTrack(name: string): Track {
        const requestedTrack = this.tracks.find(track => track.name === name);
        if (requestedTrack) { return requestedTrack.toTrack() };

        const newTrack = TrackBuilder.designTrack(name);
        this.tracks.push(newTrack.toStockable());
        return newTrack;
    }

    public saveRecord(trackName: string, record: StockableRecord): void {
        this.tracks = this.tracks.map(track => {
            if (track.name === trackName) {
                track.records.push(record);
            }
            return track;
        })
    }

    public getRecords(trackName: string): StockableRecord[] {
        return this.tracks.find(track => track.name = trackName)?.records || [];
    }

}