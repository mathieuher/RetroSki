import type { RideConfig } from './ride-config';
import { SkierInfos } from './skier-infos';
import type { StockableGhost } from './stockable-ghost';
import type { Track } from './track';

export class AcademyConfig implements RideConfig {
    public skierInfos = new SkierInfos('Academy skier', 'academy');
    public track: Track;
    public eventGhost?: StockableGhost;

    constructor(track: Track, eventGhost?: StockableGhost) {
        this.track = track;
        this.eventGhost = eventGhost;
    }
}
