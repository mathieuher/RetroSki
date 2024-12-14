import { TrackBuilder } from '../utils/track-builder';
import type { StockableGate } from './stockable-gate';
import type { Track } from './track';
import type { TrackStyles } from './track-styles.enum';

export class StockableTrack {
    public id?: string;
    public name: string;
    public builderVersion?: number;
    public style: TrackStyles;
    public date: Date;
    public gates: StockableGate[];

    constructor(
        id?: string,
        builderVersion?: number,
        name?: string,
        style?: TrackStyles,
        date?: Date,
        gates?: StockableGate[]
    ) {
        this.id = id;
        this.name = name!;
        this.builderVersion = builderVersion;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
    }

    public toTrack(): Track {
        return TrackBuilder.buildTrack(this);
    }
}
