import { Gate } from "../actors/gate";
import { StockableRecord } from "./stockable-record";
import { StockableTrack } from "./stockable-track";
import { TrackStyles } from "./track-styles.enum";

export class Track {
    public name: string;
    public builderVersion?: number;
    public style: TrackStyles
    public date: Date;
    public gates: Gate[];
    public records: StockableRecord[];

    constructor(builderVersion?: number, name?: string, style?: TrackStyles, date?: Date, gates?: Gate[], records?: StockableRecord[]) {
        this.builderVersion = builderVersion;
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
        this.records = records!;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(this.builderVersion, this.name, this.style, this.date, this.gates.map(gate => gate.getStockableGate()), this.records);
    }
}