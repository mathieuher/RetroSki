import Dexie, { type Table } from 'dexie';
import type { StockableTrack } from '../../game/models/stockable-track';
import type { StockableGhost } from '../../game/models/stockable-ghost';
import type { StockableRecord } from '../../game/models/stockable-record';

export class RetroskiDB extends Dexie {
    tracks!: Table<StockableTrack, string>;
    ghosts!: Table<StockableGhost, string>;
    records!: Table<StockableRecord, string>;

    constructor() {
        super('retroski');
        this.version(1).stores({
            tracks: '++id, [name+style], builderVersion',
            ghosts: 'trackId, eventId',
            records: '++id, trackId, rider'
        });
    }

    public async populate() {
        const count = await this.tracks.count();
        if (count === 0) {
            try {
                const response = await fetch('/assets/tracks/tracks.json');
                const defaultTracks: StockableTrack[] = await response.json();
                await this.tracks.bulkAdd(defaultTracks);
                console.log('Default tracks added to the local DB');
            } catch (error) {
                console.warn('Unable to load default tracks', error);
            }
        }
    }
}

export const RETROSKI_DB = new RetroskiDB();
