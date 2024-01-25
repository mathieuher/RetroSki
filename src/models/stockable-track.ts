import { TrackBuilder } from "../utils/track-builder";
import { StockableGate } from "./stockable-gate";
import { StockableRecord } from "./stockable-record";
import { Track } from "./track";
import { TrackStyles } from "./track-styles.enum";

export class StockableTrack {
    public name: string;
    public builderVersion?: number;
    public style: TrackStyles;
    public date: Date;
    public gates: StockableGate[];
    public records: StockableRecord[];

    constructor(builderVersion?: number, name?: string, style?: TrackStyles, date?: Date, gates?: StockableGate[], records?: StockableRecord[]) {
        this.name = name!;
        this.builderVersion = builderVersion;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
        this.records = records!;
    }

    public toTrack(): Track {
        return TrackBuilder.buildTrack(this);
    }
}