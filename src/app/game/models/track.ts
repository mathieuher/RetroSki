import type { Gate } from '../actors/gate';
import { StockableRecord } from './stockable-record';
import { StockableTrack } from './stockable-track';
import type { TrackStyles } from './track-styles.enum';

export class Track {
    public id?: number;
    public name: string;
    public builderVersion?: number;
    public style: TrackStyles;
    public date: Date;
    public gates: Gate[];

    constructor(id?: number, builderVersion?: number, name?: string, style?: TrackStyles, date?: Date, gates?: Gate[]) {
        this.id = id;
        this.builderVersion = builderVersion;
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
    }

    public get fullName(): string {
        return `${this.name} - ${this.style}`;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(
            this.id,
            this.builderVersion,
            this.name,
            this.style,
            this.date,
            this.gates.map(gate => gate.getStockableGate())
        );
    }
}
