import type { SkierPositioning } from './skier-positioning';
import type { TimedSector } from './timed-sector';
export class StockableGhost {
    public trackId?: number;
    public date?: Date;
    public eventId?: string;
    public rider?: string;
    public totalTime?: number;
    public timedSectors?: TimedSector[];
    public positions?: SkierPositioning[];

    constructor(
        trackId?: number,
        date?: Date,
        eventId?: string,
        rider?: string,
        totalTime?: number,
        timedSectors?: TimedSector[],
        positions?: SkierPositioning[]
    ) {
        this.trackId = trackId;
        this.date = date;
        this.eventId = eventId;
        this.rider = rider;
        this.totalTime = totalTime;
        this.timedSectors = timedSectors;
        this.positions = positions;
    }

    public getSectorTime(sectorNumber: number): number | undefined {
        return this.timedSectors ? this.timedSectors[sectorNumber - 1]?.time : undefined;
    }

    public static duplicate(ghost: StockableGhost): StockableGhost {
        return new StockableGhost(ghost.trackId, ghost.date, ghost.eventId, ghost.rider, ghost.totalTime, ghost.timedSectors, [...ghost.positions!]);
    }
}
