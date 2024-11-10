import type { StockableGhost } from './stockable-ghost';
import type { Track } from './track';

export class RaceConfig {
    public eventId: string;
    public rider: string;
    public track: Track;
    public globalGhost?: StockableGhost;
    public eventGhost?: StockableGhost;

    constructor(
        eventId: string,
        rider: string,
        track: Track,
        globalGhost?: StockableGhost,
        eventGhost?: StockableGhost
    ) {
        this.eventId = eventId;
        this.rider = rider;
        this.track = track;
        this.globalGhost = globalGhost;
        this.eventGhost = eventGhost;
    }
}
