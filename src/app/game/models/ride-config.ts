import type { SkierInfos } from './skier-infos';
import type { StockableGhost } from './stockable-ghost';
import type { Track } from './track';

export interface RideConfig {
    eventId?: string;
    skierInfos: SkierInfos;
    track: Track;
    globalGhost?: StockableGhost;
    eventGhost?: StockableGhost;
}
