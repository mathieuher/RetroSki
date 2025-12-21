import { Config } from '../config';
import type { StockableDecoration } from './stockable-decoration';
import type { StockableGate } from './stockable-gate';
import type { StockableSlopeSection } from './stockable-slope-section';
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
    public slopeSections: StockableSlopeSection[];

    constructor(
        id?: string,
        builderVersion?: number,
        name?: string,
        style?: TrackStyles,
        date?: Date,
        gates?: StockableGate[],
        decorations?: StockableDecoration[],
        slopeSections?: StockableSlopeSection[]
    ) {
        this.id = id;
        this.builderVersion = builderVersion!;
        this.name = name!;
        this.style = style!;
        this.date = date!;
        this.gates = gates!;
        this.decorations = decorations!;
        this.slopeSections = slopeSections!;
    }

    public get fullName(): string {
        return `${Track.formatTrackName(this.name)} - ${this.style}`;
    }

    public get gatesNumber(): number {
        return this.gates.length;
    }

    public get leftGatesNumber(): number {
        return this.gates.filter(g => g.pivot === 'left').length;
    }

    public get rightGatesNumber(): number {
        return this.gates.filter(g => g.pivot === 'right').length;
    }

    public get minIncline(): number {
        return (
            this.slopeSections
                ?.filter(s => s.incline > 0)
                .map(s => s.incline)
                .sort((a, b) => a - b)
                .at(0) || Config.SLOPE_CONFIG.defaultIncline
        );
    }

    public get maxIncline(): number {
        return (
            this.slopeSections
                ?.filter(s => s.incline > 0)
                .map(s => s.incline)
                .sort((a, b) => b - a)
                .at(0) || Config.SLOPE_CONFIG.defaultIncline
        );
    }

    public get avgIncline(): number {
        if (this.slopeSections) {
            const inclines = this.slopeSections
                .filter(s => s.incline)
                .map(s => s.incline)
                .reduce((acc, curr) => acc + curr);
            return Math.round(inclines / this.slopeSections.filter(s => s.incline).length);
        }
        return Config.SLOPE_CONFIG.defaultIncline;
    }

    public toStockable(): StockableTrack {
        return new StockableTrack(
            this.id,
            this.builderVersion,
            this.name,
            this.style,
            this.date,
            this.gates,
            this.decorations,
            this.slopeSections
        );
    }

    private static formatTrackName(name: string): string {
        return `${name[0].toLocaleUpperCase()}${name.substring(1).toLocaleLowerCase()}`;
    }
}
