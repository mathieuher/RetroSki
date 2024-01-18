import { Gate } from "../actors/gate";
import { StockableRecord } from "./stockable-record";
import { StockableTrack } from "./stockable-track";
import { TrackStyles } from "./track-styles.enum";

export class Track {
    public name: string;
    public style: TrackStyles
    public date: Date;
    public gates: Gate[];
    public records: StockableRecord[];

    constructor(name?: string, style?: TrackStyles, date?: Date, gates?: Gate[], records?: StockableRecord[]) {
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
        this.records = records!;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(this.name, this.style, this.date, this.gates.map(gate => gate.getStockableGate()), this.records);
    }
}