import type { StockableDecoration } from './stockable-decoration';
import type { StockableGate } from './stockable-gate';
import { StockableTrack } from './stockable-track';
import type { TrackStyles } from './track-styles.enum';

export class Track {
    public id?: string;
    public name: string;
    public builderVersion: number;
    public style: TrackStyles;
    public date: Date;
    public gates: StockableGate[];
    public decorations: StockableDecoration[];

    constructor(
        builderVersion: number,
        id?: string,
        name?: string,
        style?: TrackStyles,
        date?: Date,
        gates?: StockableGate[],
        decorations?: StockableDecoration[]
    ) {
        this.id = id;
        this.builderVersion = builderVersion;
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
        this.decorations = decorations!;
    }

    public get fullName(): string {
        return `${Track.formatTrackName(this.name)} - ${this.style}`;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(
            this.builderVersion,
            this.id,
            this.name,
            this.style,
            this.date,
            this.gates,
            this.decorations
        );
    }

    private static formatTrackName(name: string): string {
        return `${name[0].toLocaleUpperCase()}${name.substring(1).toLocaleLowerCase()}`;
    }
}
