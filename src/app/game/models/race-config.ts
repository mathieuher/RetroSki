import type { RideConfig } from './ride-config';
import type { SkierInfos } from './skier-infos';
import type { StockableGhost } from './stockable-ghost';
import type { Track } from './track';

export class RaceConfig implements RideConfig {
    public eventId: string;
    public skierInfos: SkierInfos;
    public track: Track;
    public globalGhost?: StockableGhost;
    public eventGhost?: StockableGhost;

    constructor(
        eventId: string,
        skierInfos: SkierInfos,
        track: Track,
        globalGhost?: StockableGhost,
        eventGhost?: StockableGhost
    ) {
        this.eventId = eventId;
        this.skierInfos = skierInfos;
        this.track = track;
        this.globalGhost = globalGhost;
        this.eventGhost = eventGhost;
    }
}
