import { SkierPositioning } from "./skier-positioning";
import { TimedSector } from "./timed-sector";
import { TrackStyles } from "./track-styles.enum";

export class StockableGhost {
    public date: Date;
    public eventId: string;
    public trackName: string;
    public trackVersion?: number;
    public trackStyle: TrackStyles;
    public skier: string;
    public totalTime: number;
    public timedSectors: TimedSector[];
    public positions: SkierPositioning[];

    constructor(date: Date, eventId: string, trackName: string, trackVersion: number | undefined, trackStyle: TrackStyles, skier: string, totalTime: number, timedSectors: TimedSector[], positions: SkierPositioning[]) {
        this.date = date;
        this.eventId = eventId;
        this.trackName = trackName;
        this.trackVersion = trackVersion;
        this.trackStyle = trackStyle;
        this.skier = skier;
        this.totalTime = totalTime;
        this.timedSectors = timedSectors;
        this.positions = positions;
    }

    public getSectorTime(gateNumber: number): number | undefined {
        return this.timedSectors.find(timedSector => timedSector.gateNumber === gateNumber)?.time;
    }
}