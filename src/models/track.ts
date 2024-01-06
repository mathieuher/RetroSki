import { Gate } from "../actors/gate";
import { StockableRecord } from "./stockable-record";
import { StockableTrack } from "./stockable-track";

export class Track {
    public name: string;
    public date: Date;
    public gates: Gate[];
    public records: StockableRecord[];

    constructor(name: string, date: Date, gates: Gate[], records: StockableRecord[]) {
        this.name = name;
        this.date = date;
        this.gates = gates;
        this.records = records;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(this.name, this.date, this.gates.map(gate => gate.getStockableGate()), this.records);
    }
}