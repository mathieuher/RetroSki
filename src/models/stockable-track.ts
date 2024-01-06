import { TrackBuilder } from "../utils/track-builder";
import { StockableGate } from "./stockable-gate";
import { StockableRecord } from "./stockable-record";
import { Track } from "./track";

export class StockableTrack {
    public name: string;
    public date: Date;
    public gates: StockableGate[];
    public records: StockableRecord[];

    constructor(name: string, date: Date, gates: StockableGate[], records: StockableRecord[]) {
        this.name = name;
        this.date = date;
        this.gates = gates;
        this.records = records;
    }

    public toTrack(): Track {
        return TrackBuilder.buildTrack(this);
    }
}