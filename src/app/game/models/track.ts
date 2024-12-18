import type { StockableGate } from './stockable-gate';
import { StockableTrack } from './stockable-track';
import type { TrackStyles } from './track-styles.enum';

export class Track {
    public id?: number;
    public name: string;
    public builderVersion?: number;
    public style: TrackStyles;
    public date: Date;
    public gates: StockableGate[];

    constructor(
        id?: number,
        builderVersion?: number,
        name?: string,
        style?: TrackStyles,
        date?: Date,
        gates?: StockableGate[]
    ) {
        this.id = id;
        this.builderVersion = builderVersion;
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
    }

    public get fullName(): string {
        return `${Track.formatTrackName(this.name)} - ${this.style}`;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(this.id, this.builderVersion, this.name, this.style, this.date, this.gates);
    }

    private static formatTrackName(name: string): string {
        return `${name[0].toLocaleUpperCase()}${name.substring(1).toLocaleLowerCase()}`;
    }
}
