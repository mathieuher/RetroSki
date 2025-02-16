import type { RideConfig } from './ride-config';
import { SkierInfos } from './skier-infos';
import type { Track } from './track';

export class AcademyConfig implements RideConfig {
    public skierInfos = new SkierInfos('Academy skier', 'academy');
    public track: Track;

    constructor(track: Track) {
        this.track = track;
    }
}
